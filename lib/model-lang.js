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

    // check for anonymous types when more than 1 type specified
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

  if (types.length > 1 && types.find(function (t) {
    return t.name === '';
  })) {
    violations.push({
      message: 'Anonymous types are not allowed when there are more than 1 type specified'
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC1sYW5nLmpzIl0sIm5hbWVzIjpbInBhcnNlciIsIkRBVEFfVFlQRVMiLCJfZmluZER1cGVzIiwiYXJyIiwiY291bnRzIiwicmVkdWNlIiwibyIsImEiLCJmaWx0ZXIiLCJuIiwiYyIsIm1hcCIsIl9wYXJzZSIsInN0ciIsInBhcnNlIiwiX2NvbXBpbGUiLCJpbnB1dFR5cGVzIiwidHlwZXMiLCJ2aW9sYXRpb25zIiwidHlwZSIsInByb3BlcnRpZXMiLCJkdXBlcyIsInAiLCJuYW1lIiwibGVuZ3RoIiwicHVzaCIsIm1lc3NhZ2UiLCJqb2luIiwidHlwZURlc2NyaXB0b3IiLCJ2YWxpZGF0ZSIsIm9yaWdpbmFsVmFsdWUiLCJlcnJvcnMiLCJmaW5pc2hlZFZhbHVlIiwicHJvcCIsInVuZGVmaW5lZCIsImRlZmF1bHRWYWx1ZSIsImlzUmVxdWlyZWQiLCJwcm9wZXJ0eSIsInZhbGlkYXRvciIsImVycm9yIiwidmFsdWUiLCJydWxlcyIsInJ1bGUiLCJkYXRhVHlwZSIsInByb3BEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0UnVsZVZhbGlkYXRvciIsImNvbnNvbGUiLCJsb2ciLCJmaW5kIiwidCIsIl9saW5rIiwibmFtZXMiLCJidWlsZEVycm9yIiwidmlvbGF0aW9uTGluZXMiLCJlcnIiLCJFcnJvciIsInYiLCJjb21waWxlIiwiQXJyYXkiLCJpc0FycmF5IiwicGFyc2VkVHlwZXMiLCJjb21waWxlZFR5cGVzIiwibGlua2VkVHlwZXMiLCJtb2RlbCIsIm1kbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7SUFBWUEsTTs7QUFDWjs7SUFBWUMsVTs7Ozs7O0FBRVosU0FBU0MsVUFBVCxDQUFvQkMsR0FBcEIsRUFBeUI7QUFDdkIsTUFBTUMsU0FBU0QsSUFBSUUsTUFBSixDQUFXLFVBQUNDLENBQUQsRUFBSUMsQ0FB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QyxFQUF5QztBQUN2QyxVQUFNK0IsV0FBV1MsY0FBYzlDLFVBQXpCLENBQU47QUFDRDs7QUFFRCxNQUFNK0MsY0FBY1osTUFBTVcsY0FBYy9DLEtBQXBCLENBQXBCO0FBQ0EsTUFBSWdELFlBQVkvQyxVQUFaLENBQXVCTSxNQUF2QixHQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxVQUFNK0IsV0FBV1UsWUFBWS9DLFVBQXZCLENBQU47QUFDRDs7QUFFRCxTQUFPK0MsWUFBWWhELEtBQW5CO0FBQ0Q7O0FBRUQsU0FBU2lELEtBQVQsQ0FBZXJELEdBQWYsRUFBb0I7QUFDbEIsU0FBTytDLFFBQVEvQyxHQUFSLEVBQWEsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsSUFBTXNELE1BQU07QUFDVlAsa0JBRFU7QUFFVk07QUFGVSxDQUFaOztrQkFLZUMsRyIsImZpbGUiOiJtb2RlbC1sYW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRU9MIH0gZnJvbSAnb3MnO1xuaW1wb3J0IGpvaSBmcm9tICcuL2pvaSc7XG5pbXBvcnQgKiBhcyBwYXJzZXIgZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0ICogYXMgREFUQV9UWVBFUyBmcm9tICcuL2RhdGEtdHlwZXMnO1xuXG5mdW5jdGlvbiBfZmluZER1cGVzKGFycikge1xuICBjb25zdCBjb3VudHMgPSBhcnIucmVkdWNlKChvLCBhKSA9PiB7XG4gICAgaWYgKCFvW2FdKSB7IG9bYV0gPSAwIH1cbiAgICArK29bYV07XG4gICAgcmV0dXJuIG87XG4gIH0sIHt9KTtcblxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoY291bnRzKS5maWx0ZXIoKFtuLCBjXSkgPT4gYyA+IDEpLm1hcCgoW24sIGNdKSA9PiBuKTtcbn1cblxuLy8gdGFrZXMgaW4gYSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIDEgb3IgbW9yZSB0eXBlc1xuLy8gcmV0dXJucyBhbiBhcnJheSBvZiB7IHR5cGU6ICcnLCBwcm9wZXJ0aWVzOiBbeyBuYW1lOiAnJywgZGF0YVR5cGU6ICcnLCBydWxlczogW10gfV0gfVxuZnVuY3Rpb24gX3BhcnNlKHN0cikge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlKHN0cik7XG59XG5cbi8vIHRha2VzIGluIGFuIGFycmF5IG9mIHR5cGVzXG5mdW5jdGlvbiBfY29tcGlsZShpbnB1dFR5cGVzKSB7XG4gIGNvbnN0IHR5cGVzID0gW107XG4gIGNvbnN0IHZpb2xhdGlvbnMgPSBbXTtcblxuICBmb3IgKGxldCB7IHR5cGUsIHByb3BlcnRpZXMgfSBvZiBpbnB1dFR5cGVzKSB7XG4gICAgY29uc3QgZHVwZXMgPSBfZmluZER1cGVzKHByb3BlcnRpZXMubWFwKHAgPT4gcC5uYW1lKSk7XG4gICAgaWYgKGR1cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZpb2xhdGlvbnMucHVzaCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIG1lc3NhZ2U6IGBEdXBsaWNhdGUgcHJvcGVydGllczogJHtkdXBlcy5qb2luKCcsICcpfWBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGVEZXNjcmlwdG9yID0ge1xuICAgICAgbmFtZTogdHlwZSxcbiAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgdmFsaWRhdGUob3JpZ2luYWxWYWx1ZSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgICBjb25zdCBmaW5pc2hlZFZhbHVlID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBPYmplY3QudmFsdWVzKHR5cGVEZXNjcmlwdG9yLnByb3BlcnRpZXMpKSB7XG4gICAgICAgICAgZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdID0gb3JpZ2luYWxWYWx1ZVtwcm9wLm5hbWVdO1xuXG4gICAgICAgICAgLy8gaWYgbm8gdmFsdWUsIHRoZW4gc2V0IHRvIGRlZmF1bHQgYW5kIGRvbid0IHZhbGlkYXRlXG4gICAgICAgICAgaWYgKGZpbmlzaGVkVmFsdWVbcHJvcC5uYW1lXSA9PT0gdW5kZWZpbmVkICYmIHByb3AuZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpbmlzaGVkVmFsdWVbcHJvcC5uYW1lXSA9IHByb3AuZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHllYSwgdGhpcyBpcyBwcmV0dHkgY2xlYXJcbiAgICAgICAgICBpZiAoZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdID09PSB1bmRlZmluZWQgJiYgcHJvcC5pc1JlcXVpcmVkKSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGBcIiR7cHJvcC5uYW1lfVwiIGlzIHJlcXVpcmVkYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB7IGVycm9yLCB2YWx1ZSB9ID0gcHJvcC52YWxpZGF0b3IudmFsaWRhdGUoZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGRvbmUgd2l0aCB0aGlzIHByb3BlcnR5IHNpbmNlIHRoZSByb290IHByb3AgdmFsaWRhdG9yIGlzIGEgdHlwZSB2YWxpZGF0b3JcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3AubmFtZSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmlzaGVkVmFsdWVbcHJvcC5uYW1lXSA9IHZhbHVlO1xuXG4gICAgICAgICAgZm9yIChsZXQgcnVsZSBvZiBwcm9wLnJ1bGVzKSB7XG4gICAgICAgICAgICBjb25zdCB7IGVycm9yLCB2YWx1ZSB9ID0gcnVsZS52YWxpZGF0b3IudmFsaWRhdGUoZmluaXNoZWRWYWx1ZVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICBlcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcC5uYW1lLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaW5pc2hlZFZhbHVlW3Byb3AubmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9ycyxcbiAgICAgICAgICB2YWx1ZTogZmluaXNoZWRWYWx1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BlcnRpZXMpIHtcbiAgICAgIGNvbnN0IGRhdGFUeXBlID0gREFUQV9UWVBFU1twcm9wLmRhdGFUeXBlXTtcblxuICAgICAgaWYgKCFkYXRhVHlwZSkge1xuICAgICAgICB2aW9sYXRpb25zLnB1c2goe1xuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgcHJvcGVydHk6IHByb3AubmFtZSxcbiAgICAgICAgICBtZXNzYWdlOiBgVW5rbm93biBkYXRhIHR5cGU6ICR7cHJvcC5kYXRhVHlwZX1gXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJvcERlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgbmFtZTogcHJvcC5uYW1lLFxuICAgICAgICAgIHR5cGU6IHByb3AuZGF0YVR5cGUsXG4gICAgICAgICAgaXNSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgcnVsZXM6IFtdLFxuICAgICAgICAgIHZhbGlkYXRvcjogZGF0YVR5cGUudmFsaWRhdG9yKClcbiAgICAgICAgfTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcERlc2NyaXB0b3IsICd2YWxpZGF0b3InLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgcnVsZSBvZiBwcm9wLnJ1bGVzKSB7XG4gICAgICAgICAgaWYgKHJ1bGUucHJvcGVydHkgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgICAgcHJvcERlc2NyaXB0b3IuZGVmYXVsdFZhbHVlID0gcnVsZS52YWx1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGUucHJvcGVydHkgPT09ICdyZXF1aXJlZCcpIHtcbiAgICAgICAgICAgIHByb3BEZXNjcmlwdG9yLmlzUmVxdWlyZWQgPSBydWxlLnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGF0YVR5cGUuZ2V0UnVsZVZhbGlkYXRvcikge1xuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocnVsZSwgJ3ZhbGlkYXRvcicsIHtcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGF0YVR5cGUuZ2V0UnVsZVZhbGlkYXRvcihydWxlKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIHR5cGUgbm90IGltcGxlbWVudGVkOicsIHByb3AuZGF0YVR5cGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcm9wRGVzY3JpcHRvci5ydWxlcy5wdXNoKHJ1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGVEZXNjcmlwdG9yLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHByb3BEZXNjcmlwdG9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHR5cGVzLnB1c2godHlwZURlc2NyaXB0b3IpO1xuICB9XG5cbiAgLy8gY2hlY2sgZm9yIGFub255bW91cyB0eXBlcyB3aGVuIG1vcmUgdGhhbiAxIHR5cGUgc3BlY2lmaWVkXG4gIGlmICh0eXBlcy5sZW5ndGggPiAxICYmIHR5cGVzLmZpbmQodCA9PiB0Lm5hbWUgPT09ICcnKSkge1xuICAgIHZpb2xhdGlvbnMucHVzaCh7XG4gICAgICBtZXNzYWdlOiAnQW5vbnltb3VzIHR5cGVzIGFyZSBub3QgYWxsb3dlZCB3aGVuIHRoZXJlIGFyZSBtb3JlIHRoYW4gMSB0eXBlIHNwZWNpZmllZCdcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZXMsXG4gICAgdmlvbGF0aW9uc1xuICB9O1xufVxuXG5mdW5jdGlvbiBfbGluayhpbnB1dFR5cGVzKSB7XG4gIGNvbnN0IHR5cGVzID0gW107XG4gIGNvbnN0IHZpb2xhdGlvbnMgPSBbXTtcblxuICBjb25zdCBuYW1lcyA9IHR5cGVzLm1hcCh0ID0+IHQubmFtZSkuZmlsdGVyKG4gPT4gbik7XG4gIGNvbnN0IGR1cGVzID0gX2ZpbmREdXBlcyhuYW1lcyk7XG5cbiAgaWYgKGR1cGVzLmxlbmd0aCA+IDApIHtcbiAgICB2aW9sYXRpb25zLnB1c2goe1xuICAgICAgbWVzc2FnZTogYER1cGxpY2F0ZSB0eXBlczogJHtkdXBlcy5qb2luKCcsICcpfWBcbiAgICB9KTtcbiAgfVxuXG4gIGZvciAobGV0IHR5cGUgb2YgaW5wdXRUeXBlcykge1xuICAgIHR5cGVzLnB1c2goe1xuICAgICAgLi4udHlwZVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlcyxcbiAgICB2aW9sYXRpb25zXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRXJyb3IodmlvbGF0aW9ucykge1xuICBjb25zdCB2aW9sYXRpb25MaW5lcyA9IHZpb2xhdGlvbnMubWFwKCh7IHR5cGUsIHByb3BlcnR5LCBtZXNzYWdlIH0pID0+IHtcbiAgICBpZiAodHlwZSAmJiBwcm9wZXJ0eSkge1xuICAgICAgbWVzc2FnZSA9IGAke3R5cGV9Ojoke3Byb3BlcnR5fTogJHttZXNzYWdlfWA7XG4gICAgfSBlbHNlIGlmICh0eXBlKSB7XG4gICAgICBtZXNzYWdlID0gYCR7dHlwZX06ICR7bWVzc2FnZX1gO1xuICAgIH0gZWxzZSBpZiAocHJvcGVydHkpIHtcbiAgICAgIG1lc3NhZ2UgPSBgOjoke3Byb3BlcnR5fTogJHttZXNzYWdlfWA7XG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlO1xuICB9KTtcblxuICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoW1xuICAgIGAke3Zpb2xhdGlvbnMubGVuZ3RofSB2aW9sYXRpb24ocylgLFxuICAgIC4uLnZpb2xhdGlvbkxpbmVzLm1hcCh2ID0+IGAgICR7dn1gKVxuICBdLmpvaW4oRU9MKSk7XG4gIGVyci52aW9sYXRpb25zID0gdmlvbGF0aW9ucztcbiAgcmV0dXJuIGVycjtcbn1cblxuZnVuY3Rpb24gY29tcGlsZShzdHIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RyKSkge1xuICAgIHN0ciA9IHN0ci5qb2luKCcgJyk7XG4gIH1cblxuICBjb25zdCBwYXJzZWRUeXBlcyA9IF9wYXJzZShzdHIpO1xuXG4gIGNvbnN0IGNvbXBpbGVkVHlwZXMgPSBfY29tcGlsZShwYXJzZWRUeXBlcyk7XG4gIGlmIChjb21waWxlZFR5cGVzLnZpb2xhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGJ1aWxkRXJyb3IoY29tcGlsZWRUeXBlcy52aW9sYXRpb25zKTtcbiAgfVxuXG4gIGNvbnN0IGxpbmtlZFR5cGVzID0gX2xpbmsoY29tcGlsZWRUeXBlcy50eXBlcyk7XG4gIGlmIChsaW5rZWRUeXBlcy52aW9sYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBidWlsZEVycm9yKGxpbmtlZFR5cGVzLnZpb2xhdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIGxpbmtlZFR5cGVzLnR5cGVzO1xufVxuXG5mdW5jdGlvbiBtb2RlbChzdHIpIHtcbiAgcmV0dXJuIGNvbXBpbGUoc3RyKVswXTtcbn1cblxuY29uc3QgbWRsID0ge1xuICBjb21waWxlLFxuICBtb2RlbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWRsO1xuIl19