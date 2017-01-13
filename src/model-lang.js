import { EOL } from 'os';
import joi from './joi';
import * as parser from './parser';
import * as DATA_TYPES from './data-types';

function _findDupes(arr) {
  const counts = arr.reduce((o, a) => {
    if (!o[a]) { o[a] = 0 }
    ++o[a];
    return o;
  }, {});

  return Object.entries(counts).filter(([n, c]) => c > 1).map(([n, c]) => n);
}

// takes in a string that represents 1 or more types
// returns an array of { type: '', properties: [{ name: '', dataType: '', rules: [] }] }
function _parse(str) {
  return parser.parse(str);
}

// takes in an array of types
function _compile(inputTypes) {
  const types = [];
  const violations = [];

  for (let { type, properties } of inputTypes) {
    const dupes = _findDupes(properties.map(p => p.name));
    if (dupes.length > 0) {
      violations.push({
        type,
        message: `Duplicate properties: ${dupes.join(', ')}`
      });
    }

    const typeDescriptor = {
      name: type,
      properties: [],
      validator: joi.object().options({ abortEarly: false }),
      validate(value) {
        const res = joi.validate(value, typeDescriptor.validator);
        return {
          errors: res.error ? res.error.details : null,
          value: res.value
        };
      }
    };

    for (let prop of properties) {
      const dataType = DATA_TYPES[prop.dataType];

      if (!dataType) {
        violations.push({
          type,
          property: prop.name,
          message: `Unknown data type: ${prop.dataType}`
        });
      } else {
        const propDescriptor = {
          name: prop.name,
          type: prop.dataType,
          dataType: dataType.type,
          isRequired: false,
          defaultValue: undefined,
          rules: [],
          validator: dataType.validator()
        };

        for (let rule of prop.rules) {
          if (rule.property === 'default') {
            propDescriptor.defaultValue = rule.value;
          } else if (rule.property === 'required') {
            propDescriptor.isRequired = rule.value;
          } else {
            propDescriptor.rules.push(rule);
            if (dataType.addRule) {
              propDescriptor.validator = dataType.addRule(propDescriptor.validator, rule);
            }
          }
        }

        if (propDescriptor.isRequired) {
          propDescriptor.validator = propDescriptor.validator.required();
        }
        if (propDescriptor.defaultValue !== undefined) {
          propDescriptor.validator = propDescriptor.validator.default(propDescriptor.defaultValue);
        }

        typeDescriptor.properties.push(propDescriptor);
      }
    }

    typeDescriptor.validator = typeDescriptor.validator.keys(
      typeDescriptor.properties.reduce((o, { name, validator }) => {
        o[name] = validator;
        return o;
      }, {})
    );

    types.push(typeDescriptor);
  }

  return {
    types,
    violations
  };
}

function _link(inputTypes) {
  const types = [];
  const violations = [];

  const names = types.map(t => t.name).filter(n => n);
  const dupes = _findDupes(names);

  if (dupes.length > 0) {
    violations.push({
      message: `Duplicate types: ${dupes.join(', ')}`
    });
  }

  for (let type of inputTypes) {
    types.push({
      ...type
    });
  }

  return {
    types,
    violations
  };
}

function buildError(violations) {
  const violationLines = violations.map(({ type, property, message }) => {
    if (type && property) {
      message = `${type}::${property}: ${message}`;
    } else if (type) {
      message = `${type}: ${message}`;
    } else if (property) {
      message = `::${property}: ${message}`;
    }
    return message;
  });

  const err = new Error([
    `${violations.length} violation(s)`,
    ...violationLines.map(v => `  ${v}`)
  ].join(EOL));
  err.violations = violations;
  return err;
}

export function compile(str) {
  if (Array.isArray(str)) {
    str = str.join(' ');
  }

  const parsedTypes = _parse(str);
  // parsedTypes.forEach(t => console.log(t));

  const compiledTypes = _compile(parsedTypes);
  if (compiledTypes.violations.length > 0) {
    throw buildError(compiledTypes.violations);
  }

  const linkedTypes = _link(compiledTypes.types);
  if (linkedTypes.violations.length > 0) {
    throw buildError(linkedTypes.violations);
  }

  return linkedTypes.types;
}

export function model(str) {
  return compile(str)[0];
}
