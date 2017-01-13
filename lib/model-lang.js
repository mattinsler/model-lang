'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

exports.compile = compile;
exports.model = model;

var _os = require('os');

var _joi = require('./joi');

var _joi2 = _interopRequireDefault(_joi);

var _parser = require('./parser');

var parser = _interopRequireWildcard(_parser);

var _dataTypes = require('./data-types');

var DATA_TYPES = _interopRequireWildcard(_dataTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _findDupes(arr) {
  var counts = arr.reduce(function (o, a) {
    if (!o[a]) {
      o[a] = 0;
    }
    ++o[a];
    return o;
  }, {});

  return (0, _entries2.default)(counts).filter(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        n = _ref2[0],
        c = _ref2[1];

    return c > 1;
  }).map(function (_ref3) {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
        n = _ref4[0],
        c = _ref4[1];

    return n;
  });
}

// takes in a string that represents 1 or more types
// returns an array of { type: '', properties: [{ name: '', dataType: '', rules: [] }] }
function _parse(str) {
  return parser.parse(str);
}

// takes in an array of types
function _compile(inputTypes) {
  var types = [];
  var violations = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var _ref5 = _step.value;
      var type = _ref5.type,
          properties = _ref5.properties;

      var dupes = _findDupes(properties.map(function (p) {
        return p.name;
      }));
      if (dupes.length > 0) {
        violations.push({
          type: type,
          message: 'Duplicate properties: ' + dupes.join(', ')
        });
      }

      var typeDescriptor = {
        name: type,
        properties: [],
        validator: _joi2.default.object().options({ abortEarly: false }),
        validate: function validate(value) {
          var res = _joi2.default.validate(value, typeDescriptor.validator);
          return {
            errors: res.error ? res.error.details : null,
            value: res.value
          };
        }
      };

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(properties), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var prop = _step2.value;

          var dataType = DATA_TYPES[prop.dataType];

          if (!dataType) {
            violations.push({
              type: type,
              property: prop.name,
              message: 'Unknown data type: ' + prop.dataType
            });
          } else {
            var propDescriptor = {
              name: prop.name,
              type: prop.dataType,
              dataType: dataType.type,
              isRequired: false,
              defaultValue: undefined,
              rules: [],
              validator: dataType.validator()
            };

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = (0, _getIterator3.default)(prop.rules), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var rule = _step3.value;

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
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
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
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      typeDescriptor.validator = typeDescriptor.validator.keys(typeDescriptor.properties.reduce(function (o, _ref6) {
        var name = _ref6.name,
            validator = _ref6.validator;

        o[name] = validator;
        return o;
      }, {}));

      types.push(typeDescriptor);
    };

    for (var _iterator = (0, _getIterator3.default)(inputTypes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    types: types,
    violations: violations
  };
}

function _link(inputTypes) {
  var types = [];
  var violations = [];

  var names = types.map(function (t) {
    return t.name;
  }).filter(function (n) {
    return n;
  });
  var dupes = _findDupes(names);

  if (dupes.length > 0) {
    violations.push({
      message: 'Duplicate types: ' + dupes.join(', ')
    });
  }

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = (0, _getIterator3.default)(inputTypes), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _type = _step4.value;

      types.push((0, _extends3.default)({}, _type));
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return {
    types: types,
    violations: violations
  };
}

function buildError(violations) {
  var violationLines = violations.map(function (_ref7) {
    var type = _ref7.type,
        property = _ref7.property,
        message = _ref7.message;

    if (type && property) {
      message = type + '::' + property + ': ' + message;
    } else if (type) {
      message = type + ': ' + message;
    } else if (property) {
      message = '::' + property + ': ' + message;
    }
    return message;
  });

  var err = new Error([violations.length + ' violation(s)'].concat((0, _toConsumableArray3.default)(violationLines.map(function (v) {
    return '  ' + v;
  }))).join(_os.EOL));
  err.violations = violations;
  return err;
}

function compile(str) {
  if (Array.isArray(str)) {
    str = str.join(' ');
  }

  var parsedTypes = _parse(str);
  // parsedTypes.forEach(t => console.log(t));

  var compiledTypes = _compile(parsedTypes);
  if (compiledTypes.violations.length > 0) {
    throw buildError(compiledTypes.violations);
  }

  var linkedTypes = _link(compiledTypes.types);
  if (linkedTypes.violations.length > 0) {
    throw buildError(linkedTypes.violations);
  }

  return linkedTypes.types;
}

function model(str) {
  return compile(str)[0];
}