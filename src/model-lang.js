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
      properties: {},
      validate(originalValue = {}) {
        const errors = [];
        const finishedValue = {};

        for (let prop of Object.values(typeDescriptor.properties)) {
          finishedValue[prop.name] = originalValue[prop.name];

          // if no value, then set to default and don't validate
          if (finishedValue[prop.name] === undefined && prop.defaultValue !== undefined) {
            finishedValue[prop.name] = prop.defaultValue;
            continue;
          }
          // yea, this is pretty clear
          if (finishedValue[prop.name] === undefined && prop.isRequired) {
            errors.push({
              type,
              property: prop.name,
              message: `"${prop.name}" is required`
            });
            continue;
          }

          const { error, value } = prop.validator.validate(finishedValue[prop.name]);
          if (error) {
            // done with this property since the root prop validator is a type validator
            errors.push({
              type,
              property: prop.name,
              message: error.message
            });
          }
          finishedValue[prop.name] = value;

          for (let rule of prop.rules) {
            const { error, value } = rule.validator.validate(finishedValue[prop.name]);
            if (error) {
              errors.push({
                type,
                property: prop.name,
                message: error.message
              });
            } else {
              finishedValue[prop.name] = value;
            }
          }
        }

        return {
          errors,
          value: finishedValue
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
          isRequired: false,
          defaultValue: undefined,
          rules: [],
          validator: dataType.validator()
        };

        Object.defineProperty(propDescriptor, 'validator', {
          enumerable: false
        });

        for (let rule of prop.rules) {
          if (rule.property === 'default') {
            propDescriptor.defaultValue = rule.value;
          } else if (rule.property === 'required') {
            propDescriptor.isRequired = rule.value;
          } else {
            if (dataType.getRuleValidator) {
              Object.defineProperty(rule, 'validator', {
                enumerable: false,
                value: dataType.getRuleValidator(rule)
              });
            } else {
              console.log('Data type not implemented:', prop.dataType);
            }

            propDescriptor.rules.push(rule);
          }
        }

        typeDescriptor.properties[prop.name] = propDescriptor;
      }
    }

    types.push(typeDescriptor);
  }

  // check for anonymous types when more than 1 type specified
  if (types.length > 1 && types.find(t => t.name === '')) {
    violations.push({
      message: 'Anonymous types are not allowed when there are more than 1 type specified'
    });
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

function compile(str) {
  if (Array.isArray(str)) {
    str = str.join(' ');
  }

  const parsedTypes = _parse(str);

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

function model(str) {
  return compile(str)[0];
}

const mdl = {
  compile,
  model
};

export default mdl;
