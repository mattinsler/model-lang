'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

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
        properties: {},
        validate: function validate() {
          var originalValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          var errors = [];
          var finishedValue = {};

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _values2.default)(typeDescriptor.properties)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var prop = _step2.value;

              finishedValue[prop.name] = originalValue[prop.name];

              // if no value, then set to default and don't validate
              if (finishedValue[prop.name] === undefined && prop.defaultValue !== undefined) {
                finishedValue[prop.name] = prop.defaultValue;
                continue;
              }
              // yea, this is pretty clear
              if (finishedValue[prop.name] === undefined && prop.isRequired) {
                errors.push({
                  type: type,
                  property: prop.name,
                  message: '"' + prop.name + '" is required'
                });
                continue;
              }

              var _prop$validator$valid = prop.validator.validate(finishedValue[prop.name]),
                  error = _prop$validator$valid.error,
                  value = _prop$validator$valid.value;

              if (error) {
                // done with this property since the root prop validator is a type validator
                errors.push({
                  type: type,
                  property: prop.name,
                  message: error.message
                });
              }
              finishedValue[prop.name] = value;

              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = (0, _getIterator3.default)(prop.rules), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var rule = _step3.value;

                  var _rule$validator$valid = rule.validator.validate(finishedValue[prop.name]),
                      _error = _rule$validator$valid.error,
                      _value = _rule$validator$valid.value;

                  if (_error) {
                    errors.push({
                      type: type,
                      property: prop.name,
                      message: _error.message
                    });
                  } else {
                    finishedValue[prop.name] = _value;
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

          return {
            errors: errors,
            value: finishedValue
          };
        }
      };

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(properties), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var prop = _step4.value;

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
              isRequired: false,
              defaultValue: undefined,
              rules: [],
              validator: dataType.validator()
            };

            Object.defineProperty(propDescriptor, 'validator', {
              enumerable: false
            });

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = (0, _getIterator3.default)(prop.rules), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var rule = _step5.value;

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
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            typeDescriptor.properties[prop.name] = propDescriptor;
          }
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

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = (0, _getIterator3.default)(inputTypes), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var _type = _step6.value;

      types.push((0, _extends3.default)({}, _type));
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  return {
    types: types,
    violations: violations
  };
}

function buildError(violations) {
  var violationLines = violations.map(function (_ref6) {
    var type = _ref6.type,
        property = _ref6.property,
        message = _ref6.message;

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

var mdl = {
  compile: compile,
  model: model
};

exports.default = mdl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC1sYW5nLmpzIl0sIm5hbWVzIjpbInBhcnNlciIsIkRBVEFfVFlQRVMiLCJfZmluZER1cGVzIiwiYXJyIiwiY291bnRzIiwicmVkdWNlIiwibyIsImEiLCJmaWx0ZXIiLCJuIiwiYyIsIm1hcCIsIl9wYXJzZSIsInN0ciIsInBhcnNlIiwiX2NvbXBpbGUiLCJpbnB1dFR5cGVzIiwidHlwZXMiLCJ2aW9sYXRpb25zIiwidHlwZSIsInByb3BlcnRpZXMiLCJkdXBlcyIsInAiLCJuYW1lIiwibGVuZ3RoIiwicHVzaCIsIm1lc3NhZ2UiLCJqb2luIiwidHlwZURlc2NyaXB0b3IiLCJ2YWxpZGF0ZSIsIm9yaWdpbmFsVmFsdWUiLCJlcnJvcnMiLCJmaW5pc2hlZFZhbHVlIiwicHJvcCIsInVuZGVmaW5lZCIsImRlZmF1bHRWYWx1ZSIsImlzUmVxdWlyZWQiLCJwcm9wZXJ0eSIsInZhbGlkYXRvciIsImVycm9yIiwidmFsdWUiLCJydWxlcyIsInJ1bGUiLCJkYXRhVHlwZSIsInByb3BEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0UnVsZVZhbGlkYXRvciIsImNvbnNvbGUiLCJsb2ciLCJfbGluayIsIm5hbWVzIiwidCIsImJ1aWxkRXJyb3IiLCJ2aW9sYXRpb25MaW5lcyIsImVyciIsIkVycm9yIiwidiIsImNvbXBpbGUiLCJBcnJheSIsImlzQXJyYXkiLCJwYXJzZWRUeXBlcyIsImNvbXBpbGVkVHlwZXMiLCJsaW5rZWRUeXBlcyIsIm1vZGVsIiwibWRsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztJQUFZQSxNOztBQUNaOztJQUFZQyxVOzs7Ozs7QUFFWixTQUFTQyxVQUFULENBQW9CQyxHQUFwQixFQUF5QjtBQUN2QixNQUFNQyxTQUFTRCxJQUFJRSxNQUFKLENBQVcsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7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QXZCLENBQU47QUFDRDs7QUFFRCxTQUFPOEMsWUFBWS9DLEtBQW5CO0FBQ0Q7O0FBRUQsU0FBU2dELEtBQVQsQ0FBZXBELEdBQWYsRUFBb0I7QUFDbEIsU0FBTzhDLFFBQVE5QyxHQUFSLEVBQWEsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsSUFBTXFELE1BQU07QUFDVlAsa0JBRFU7QUFFVk07QUFGVSxDQUFaOztrQkFLZUMsRyIsImZpbGUiOiJtb2RlbC1sYW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRU9MIH0gZnJvbSAnb3MnO1xuaW1wb3J0IGpvaSBmcm9tICcuL2pvaSc7XG5pbXBvcnQgKiBhcyBwYXJzZXIgZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0ICogYXMgREFUQV9UWVBFUyBmcm9tICcuL2RhdGEtdHlwZXMnO1xuXG5mdW5jdGlvbiBfZmluZER1cGVzKGFycikge1xuICBjb25zdCBjb3VudHMgPSBhcnIucmVkdWNlKChvLCBhKSA9PiB7XG4gICAgaWYgKCFvW2FdKSB7IG9bYV0gPSAwIH1cbiAgICArK29bYV07XG4gICAgcmV0dXJuIG87XG4gIH0sIHt9KTtcblxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoY291bnRzKS5maWx0ZXIoKFtuLCBjXSkgPT4gYyA+IDEpLm1hcCgoW24sIGNdKSA9PiBuKTtcbn1cblxuLy8gdGFrZXMgaW4gYSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIDEgb3IgbW9yZSB0eXBlc1xuLy8gcmV0dXJucyBhbiBhcnJheSBvZiB7IHR5cGU6ICcnLCBwcm9wZXJ0aWVzOiBbeyBuYW1lOiAnJywgZGF0YVR5cGU6ICcnLCBydWxlczogW10gfV0gfVxuZnVuY3Rpb24gX3BhcnNlKHN0cikge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlKHN0cik7XG59XG5cbi8vIHRha2VzIGluIGFuIGFycmF5IG9mIHR5cGVzXG5mdW5jdGlvbiBfY29tcGlsZShpbnB1dFR5cGVzKSB7XG4gIGNvbnN0IHR5cGVzID0gW107XG4gIGNvbnN0IHZpb2xhdGlvbnMgPSBbXTtcblxuICBmb3IgKGxldCB7IHR5cGUsIHByb3BlcnRpZXMgfSBvZiBpbnB1dFR5cGVzKSB7XG4gICAgY29uc3QgZHVwZXMgPSBfZmluZER1cGVzKHByb3BlcnRpZXMubWFwKHAgPT4gcC5uYW1lKSk7XG4gICAgaWYgKGR1cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZpb2xhdGlvbnMucHVzaCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIG1lc3NhZ2U6IGBEdXBsaWNhdGUgcHJvcGVydGllczogJHtkdXBlcy5qb2luKCcsICcpfWBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGVEZXNjcmlwdG9yID0ge1xuICAgICAgbmFtZTogdHlwZSxcbiAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgdmFsaWRhdGUob3JpZ2luYWxWYWx1ZSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgICBjb25zdCBmaW5pc2hlZFZhbHVlID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBPYmplY3QudmFsdWVzKHR5cGVEZXNjcmlwdG9yLnByb3BlcnRpZXMpKSB7XG4gICAgICAgICAgZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdID0gb3JpZ2luYWxWYWx1ZVtwcm9wLm5hbWVdO1xuXG4gICAgICAgICAgLy8gaWYgbm8gdmFsdWUsIHRoZW4gc2V0IHRvIGRlZmF1bHQgYW5kIGRvbid0IHZhbGlkYXRlXG4gICAgICAgICAgaWYgKGZpbmlzaGVkVmFsdWVbcHJvcC5uYW1lXSA9PT0gdW5kZWZpbmVkICYmIHByb3AuZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpbmlzaGVkVmFsdWVbcHJvcC5uYW1lXSA9IHByb3AuZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHllYSwgdGhpcyBpcyBwcmV0dHkgY2xlYXJcbiAgICAgICAgICBpZiAoZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdID09PSB1bmRlZmluZWQgJiYgcHJvcC5pc1JlcXVpcmVkKSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGBcIiR7cHJvcC5uYW1lfVwiIGlzIHJlcXVpcmVkYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB7IGVycm9yLCB2YWx1ZSB9ID0gcHJvcC52YWxpZGF0b3IudmFsaWRhdGUoZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGRvbmUgd2l0aCB0aGlzIHByb3BlcnR5IHNpbmNlIHRoZSByb290IHByb3AgdmFsaWRhdG9yIGlzIGEgdHlwZSB2YWxpZGF0b3JcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3AubmFtZSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmlzaGVkVmFsdWVbcHJvcC5uYW1lXSA9IHZhbHVlO1xuXG4gICAgICAgICAgZm9yIChsZXQgcnVsZSBvZiBwcm9wLnJ1bGVzKSB7XG4gICAgICAgICAgICBjb25zdCB7IGVycm9yLCB2YWx1ZSB9ID0gcnVsZS52YWxpZGF0b3IudmFsaWRhdGUoZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICBlcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcC5uYW1lLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaW5pc2hlZFZhbHVlW3Byb3AubmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9ycyxcbiAgICAgICAgICB2YWx1ZTogZmluaXNoZWRWYWx1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BlcnRpZXMpIHtcbiAgICAgIGNvbnN0IGRhdGFUeXBlID0gREFUQV9UWVBFU1twcm9wLmRhdGFUeXBlXTtcblxuICAgICAgaWYgKCFkYXRhVHlwZSkge1xuICAgICAgICB2aW9sYXRpb25zLnB1c2goe1xuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgcHJvcGVydHk6IHByb3AubmFtZSxcbiAgICAgICAgICBtZXNzYWdlOiBgVW5rbm93biBkYXRhIHR5cGU6ICR7cHJvcC5kYXRhVHlwZX1gXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJvcERlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgbmFtZTogcHJvcC5uYW1lLFxuICAgICAgICAgIHR5cGU6IHByb3AuZGF0YVR5cGUsXG4gICAgICAgICAgaXNSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgcnVsZXM6IFtdLFxuICAgICAgICAgIHZhbGlkYXRvcjogZGF0YVR5cGUudmFsaWRhdG9yKClcbiAgICAgICAgfTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcERlc2NyaXB0b3IsICd2YWxpZGF0b3InLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgcnVsZSBvZiBwcm9wLnJ1bGVzKSB7XG4gICAgICAgICAgaWYgKHJ1bGUucHJvcGVydHkgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgICAgcHJvcERlc2NyaXB0b3IuZGVmYXVsdFZhbHVlID0gcnVsZS52YWx1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGUucHJvcGVydHkgPT09ICdyZXF1aXJlZCcpIHtcbiAgICAgICAgICAgIHByb3BEZXNjcmlwdG9yLmlzUmVxdWlyZWQgPSBydWxlLnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUuZ2V0UnVsZVZhbGlkYXRvcikge1xuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocnVsZSwgJ3ZhbGlkYXRvcicsIHtcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGF0YVR5cGUuZ2V0UnVsZVZhbGlkYXRvcihydWxlKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIHR5cGUgbm90IGltcGxlbWVudGVkOicsIHByb3AuZGF0YVR5cGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcm9wRGVzY3JpcHRvci5ydWxlcy5wdXNoKHJ1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGVEZXNjcmlwdG9yLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHByb3BEZXNjcmlwdG9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHR5cGVzLnB1c2godHlwZURlc2NyaXB0b3IpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlcyxcbiAgICB2aW9sYXRpb25zXG4gIH07XG59XG5cbmZ1bmN0aW9uIF9saW5rKGlucHV0VHlwZXMpIHtcbiAgY29uc3QgdHlwZXMgPSBbXTtcbiAgY29uc3QgdmlvbGF0aW9ucyA9IFtdO1xuXG4gIGNvbnN0IG5hbWVzID0gdHlwZXMubWFwKHQgPT4gdC5uYW1lKS5maWx0ZXIobiA9PiBuKTtcbiAgY29uc3QgZHVwZXMgPSBfZmluZER1cGVzKG5hbWVzKTtcblxuICBpZiAoZHVwZXMubGVuZ3RoID4gMCkge1xuICAgIHZpb2xhdGlvbnMucHVzaCh7XG4gICAgICBtZXNzYWdlOiBgRHVwbGljYXRlIHR5cGVzOiAke2R1cGVzLmpvaW4oJywgJyl9YFxuICAgIH0pO1xuICB9XG5cbiAgZm9yIChsZXQgdHlwZSBvZiBpbnB1dFR5cGVzKSB7XG4gICAgdHlwZXMucHVzaCh7XG4gICAgICAuLi50eXBlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR5cGVzLFxuICAgIHZpb2xhdGlvbnNcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFcnJvcih2aW9sYXRpb25zKSB7XG4gIGNvbnN0IHZpb2xhdGlvbkxpbmVzID0gdmlvbGF0aW9ucy5tYXAoKHsgdHlwZSwgcHJvcGVydHksIG1lc3NhZ2UgfSkgPT4ge1xuICAgIGlmICh0eXBlICYmIHByb3BlcnR5KSB7XG4gICAgICBtZXNzYWdlID0gYCR7dHlwZX06OiR7cHJvcGVydHl9OiAke21lc3NhZ2V9YDtcbiAgICB9IGVsc2UgaWYgKHR5cGUpIHtcbiAgICAgIG1lc3NhZ2UgPSBgJHt0eXBlfTogJHttZXNzYWdlfWA7XG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0eSkge1xuICAgICAgbWVzc2FnZSA9IGA6OiR7cHJvcGVydHl9OiAke21lc3NhZ2V9YDtcbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG4gIH0pO1xuXG4gIGNvbnN0IGVyciA9IG5ldyBFcnJvcihbXG4gICAgYCR7dmlvbGF0aW9ucy5sZW5ndGh9IHZpb2xhdGlvbihzKWAsXG4gICAgLi4udmlvbGF0aW9uTGluZXMubWFwKHYgPT4gYCAgJHt2fWApXG4gIF0uam9pbihFT0wpKTtcbiAgZXJyLnZpb2xhdGlvbnMgPSB2aW9sYXRpb25zO1xuICByZXR1cm4gZXJyO1xufVxuXG5mdW5jdGlvbiBjb21waWxlKHN0cikge1xuICBpZiAoQXJyYXkuaXNBcnJheShzdHIpKSB7XG4gICAgc3RyID0gc3RyLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGNvbnN0IHBhcnNlZFR5cGVzID0gX3BhcnNlKHN0cik7XG5cbiAgY29uc3QgY29tcGlsZWRUeXBlcyA9IF9jb21waWxlKHBhcnNlZFR5cGVzKTtcbiAgaWYgKGNvbXBpbGVkVHlwZXMudmlvbGF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgYnVpbGRFcnJvcihjb21waWxlZFR5cGVzLnZpb2xhdGlvbnMpO1xuICB9XG5cbiAgY29uc3QgbGlua2VkVHlwZXMgPSBfbGluayhjb21waWxlZFR5cGVzLnR5cGVzKTtcbiAgaWYgKGxpbmtlZFR5cGVzLnZpb2xhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGJ1aWxkRXJyb3IobGlua2VkVHlwZXMudmlvbGF0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gbGlua2VkVHlwZXMudHlwZXM7XG59XG5cbmZ1bmN0aW9uIG1vZGVsKHN0cikge1xuICByZXR1cm4gY29tcGlsZShzdHIpWzBdO1xufVxuXG5jb25zdCBtZGwgPSB7XG4gIGNvbXBpbGUsXG4gIG1vZGVsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtZGw7XG4iXX0=