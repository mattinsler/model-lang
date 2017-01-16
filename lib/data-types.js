'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Email = exports.String = exports.Timestamp = exports.Date = exports.Boolean = undefined;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _joi = require('./joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unknown(_ref) {
  var operation = _ref.operation,
      property = _ref.property,
      value = _ref.value;

  var message = 'Unknown rule String.' + property;
  if (operation) {
    message += '.' + operation;
  }
  return new Error(message);
}

var Boolean = exports.Boolean = {
  validator: function validator() {
    return _joi2.default.boolean();
  },
  getRuleValidator: function getRuleValidator(_ref2) {
    var operation = _ref2.operation,
        property = _ref2.property,
        value = _ref2.value;

    throw unknown({ operation: operation, property: property, value: value });
  }
};

var Date = exports.Date = {
  validator: function validator() {
    return _joi2.default.date();
  },
  getRuleValidator: function getRuleValidator(_ref3) {
    var operation = _ref3.operation,
        property = _ref3.property,
        value = _ref3.value;

    throw unknown({ operation: operation, property: property, value: value });
  }
};

var Timestamp = exports.Timestamp = {
  validator: function validator() {
    return _joi2.default.date().timestamp();
  },
  getRuleValidator: function getRuleValidator(_ref4) {
    var operation = _ref4.operation,
        property = _ref4.property,
        value = _ref4.value;

    throw unknown({ operation: operation, property: property, value: value });
  }
};

var String = exports.String = {
  validator: function validator() {
    return _joi2.default.string().empty('');
  },
  getRuleValidator: function getRuleValidator(_ref5) {
    var operation = _ref5.operation,
        property = _ref5.property,
        value = _ref5.value;

    switch (property) {
      case 'contains':
        return this.validator().contains(value);
      case 'matches':
        return this.validator().regex(value);
      case 'length':
        switch (operation) {
          case '<':
            return this.validator().max(value - 1);
          case '<=':
            return this.validator().max(value);
          case '>':
            return this.validator().min(value + 1);
          case '>=':
            return this.validator().min(value);
          case '==':
            return this.validator().length(value);
        }
    }

    throw unknown({ operation: operation, property: property, value: value });
  }
};

var Email = exports.Email = {
  validator: function validator() {
    return _joi2.default.string().empty('').email();
  },
  getRuleValidator: function getRuleValidator(opts) {
    return String.getRuleValidator(opts);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhLXR5cGVzLmpzIl0sIm5hbWVzIjpbInVua25vd24iLCJvcGVyYXRpb24iLCJwcm9wZXJ0eSIsInZhbHVlIiwibWVzc2FnZSIsIkVycm9yIiwiQm9vbGVhbiIsInZhbGlkYXRvciIsImJvb2xlYW4iLCJnZXRSdWxlVmFsaWRhdG9yIiwiRGF0ZSIsImRhdGUiLCJUaW1lc3RhbXAiLCJ0aW1lc3RhbXAiLCJTdHJpbmciLCJzdHJpbmciLCJlbXB0eSIsImNvbnRhaW5zIiwicmVnZXgiLCJtYXgiLCJtaW4iLCJsZW5ndGgiLCJFbWFpbCIsImVtYWlsIiwib3B0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLE9BQVQsT0FBaUQ7QUFBQSxNQUE5QkMsU0FBOEIsUUFBOUJBLFNBQThCO0FBQUEsTUFBbkJDLFFBQW1CLFFBQW5CQSxRQUFtQjtBQUFBLE1BQVRDLEtBQVMsUUFBVEEsS0FBUzs7QUFDL0MsTUFBSUMsbUNBQWlDRixRQUFyQztBQUNBLE1BQUlELFNBQUosRUFBZTtBQUNiRyxxQkFBZUgsU0FBZjtBQUNEO0FBQ0QsU0FBTyxJQUFJSSxLQUFKLENBQVVELE9BQVYsQ0FBUDtBQUNEOztBQUVNLElBQU1FLDRCQUFVO0FBQ3JCQyxXQURxQix1QkFDVDtBQUFFLFdBQU8sY0FBSUMsT0FBSixFQUFQO0FBQXNCLEdBRGY7QUFFckJDLGtCQUZxQixtQ0FFNEI7QUFBQSxRQUE5QlIsU0FBOEIsU0FBOUJBLFNBQThCO0FBQUEsUUFBbkJDLFFBQW1CLFNBQW5CQSxRQUFtQjtBQUFBLFFBQVRDLEtBQVMsU0FBVEEsS0FBUzs7QUFDL0MsVUFBTUgsUUFBUSxFQUFFQyxvQkFBRixFQUFhQyxrQkFBYixFQUF1QkMsWUFBdkIsRUFBUixDQUFOO0FBQ0Q7QUFKb0IsQ0FBaEI7O0FBT0EsSUFBTU8sc0JBQU87QUFDbEJILFdBRGtCLHVCQUNOO0FBQUUsV0FBTyxjQUFJSSxJQUFKLEVBQVA7QUFBbUIsR0FEZjtBQUVsQkYsa0JBRmtCLG1DQUUrQjtBQUFBLFFBQTlCUixTQUE4QixTQUE5QkEsU0FBOEI7QUFBQSxRQUFuQkMsUUFBbUIsU0FBbkJBLFFBQW1CO0FBQUEsUUFBVEMsS0FBUyxTQUFUQSxLQUFTOztBQUMvQyxVQUFNSCxRQUFRLEVBQUVDLG9CQUFGLEVBQWFDLGtCQUFiLEVBQXVCQyxZQUF2QixFQUFSLENBQU47QUFDRDtBQUppQixDQUFiOztBQU9BLElBQU1TLGdDQUFZO0FBQ3ZCTCxXQUR1Qix1QkFDWDtBQUFFLFdBQU8sY0FBSUksSUFBSixHQUFXRSxTQUFYLEVBQVA7QUFBK0IsR0FEdEI7QUFFdkJKLGtCQUZ1QixtQ0FFMEI7QUFBQSxRQUE5QlIsU0FBOEIsU0FBOUJBLFNBQThCO0FBQUEsUUFBbkJDLFFBQW1CLFNBQW5CQSxRQUFtQjtBQUFBLFFBQVRDLEtBQVMsU0FBVEEsS0FBUzs7QUFDL0MsVUFBTUgsUUFBUSxFQUFFQyxvQkFBRixFQUFhQyxrQkFBYixFQUF1QkMsWUFBdkIsRUFBUixDQUFOO0FBQ0Q7QUFKc0IsQ0FBbEI7O0FBT0EsSUFBTVcsMEJBQVM7QUFDcEJQLFdBRG9CLHVCQUNSO0FBQUUsV0FBTyxjQUFJUSxNQUFKLEdBQWFDLEtBQWIsQ0FBbUIsRUFBbkIsQ0FBUDtBQUErQixHQUR6QjtBQUVwQlAsa0JBRm9CLG1DQUU2QjtBQUFBLFFBQTlCUixTQUE4QixTQUE5QkEsU0FBOEI7QUFBQSxRQUFuQkMsUUFBbUIsU0FBbkJBLFFBQW1CO0FBQUEsUUFBVEMsS0FBUyxTQUFUQSxLQUFTOztBQUMvQyxZQUFRRCxRQUFSO0FBQ0UsV0FBSyxVQUFMO0FBQWlCLGVBQU8sS0FBS0ssU0FBTCxHQUFpQlUsUUFBakIsQ0FBMEJkLEtBQTFCLENBQVA7QUFDakIsV0FBSyxTQUFMO0FBQWdCLGVBQU8sS0FBS0ksU0FBTCxHQUFpQlcsS0FBakIsQ0FBdUJmLEtBQXZCLENBQVA7QUFDaEIsV0FBSyxRQUFMO0FBQ0UsZ0JBQVFGLFNBQVI7QUFDRSxlQUFLLEdBQUw7QUFBVSxtQkFBTyxLQUFLTSxTQUFMLEdBQWlCWSxHQUFqQixDQUFxQmhCLFFBQVEsQ0FBN0IsQ0FBUDtBQUNWLGVBQUssSUFBTDtBQUFXLG1CQUFPLEtBQUtJLFNBQUwsR0FBaUJZLEdBQWpCLENBQXFCaEIsS0FBckIsQ0FBUDtBQUNYLGVBQUssR0FBTDtBQUFVLG1CQUFPLEtBQUtJLFNBQUwsR0FBaUJhLEdBQWpCLENBQXFCakIsUUFBUSxDQUE3QixDQUFQO0FBQ1YsZUFBSyxJQUFMO0FBQVcsbUJBQU8sS0FBS0ksU0FBTCxHQUFpQmEsR0FBakIsQ0FBcUJqQixLQUFyQixDQUFQO0FBQ1gsZUFBSyxJQUFMO0FBQVcsbUJBQU8sS0FBS0ksU0FBTCxHQUFpQmMsTUFBakIsQ0FBd0JsQixLQUF4QixDQUFQO0FBTGI7QUFKSjs7QUFhQSxVQUFNSCxRQUFRLEVBQUVDLG9CQUFGLEVBQWFDLGtCQUFiLEVBQXVCQyxZQUF2QixFQUFSLENBQU47QUFDRDtBQWpCbUIsQ0FBZjs7QUFvQkEsSUFBTW1CLHdCQUFRO0FBQ25CZixXQURtQix1QkFDUDtBQUFFLFdBQU8sY0FBSVEsTUFBSixHQUFhQyxLQUFiLENBQW1CLEVBQW5CLEVBQXVCTyxLQUF2QixFQUFQO0FBQXVDLEdBRGxDO0FBRW5CZCxrQkFGbUIsNEJBRUZlLElBRkUsRUFFSTtBQUNyQixXQUFPVixPQUFPTCxnQkFBUCxDQUF3QmUsSUFBeEIsQ0FBUDtBQUNEO0FBSmtCLENBQWQiLCJmaWxlIjoiZGF0YS10eXBlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlsIGZyb20gJ3V0aWwnO1xuaW1wb3J0IGpvaSBmcm9tICcuL2pvaSc7XG5cbmZ1bmN0aW9uIHVua25vd24oeyBvcGVyYXRpb24sIHByb3BlcnR5LCB2YWx1ZSB9KSB7XG4gIGxldCBtZXNzYWdlID0gYFVua25vd24gcnVsZSBTdHJpbmcuJHtwcm9wZXJ0eX1gO1xuICBpZiAob3BlcmF0aW9uKSB7XG4gICAgbWVzc2FnZSArPSBgLiR7b3BlcmF0aW9ufWBcbiAgfVxuICByZXR1cm4gbmV3IEVycm9yKG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgY29uc3QgQm9vbGVhbiA9IHtcbiAgdmFsaWRhdG9yKCkgeyByZXR1cm4gam9pLmJvb2xlYW4oKSB9LFxuICBnZXRSdWxlVmFsaWRhdG9yKHsgb3BlcmF0aW9uLCBwcm9wZXJ0eSwgdmFsdWUgfSkge1xuICAgIHRocm93IHVua25vd24oeyBvcGVyYXRpb24sIHByb3BlcnR5LCB2YWx1ZSB9KTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IERhdGUgPSB7XG4gIHZhbGlkYXRvcigpIHsgcmV0dXJuIGpvaS5kYXRlKCkgfSxcbiAgZ2V0UnVsZVZhbGlkYXRvcih7IG9wZXJhdGlvbiwgcHJvcGVydHksIHZhbHVlIH0pIHtcbiAgICB0aHJvdyB1bmtub3duKHsgb3BlcmF0aW9uLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBUaW1lc3RhbXAgPSB7XG4gIHZhbGlkYXRvcigpIHsgcmV0dXJuIGpvaS5kYXRlKCkudGltZXN0YW1wKCkgfSxcbiAgZ2V0UnVsZVZhbGlkYXRvcih7IG9wZXJhdGlvbiwgcHJvcGVydHksIHZhbHVlIH0pIHtcbiAgICB0aHJvdyB1bmtub3duKHsgb3BlcmF0aW9uLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBTdHJpbmcgPSB7XG4gIHZhbGlkYXRvcigpIHsgcmV0dXJuIGpvaS5zdHJpbmcoKS5lbXB0eSgnJykgfSxcbiAgZ2V0UnVsZVZhbGlkYXRvcih7IG9wZXJhdGlvbiwgcHJvcGVydHksIHZhbHVlIH0pIHtcbiAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICBjYXNlICdjb250YWlucyc6IHJldHVybiB0aGlzLnZhbGlkYXRvcigpLmNvbnRhaW5zKHZhbHVlKTtcbiAgICAgIGNhc2UgJ21hdGNoZXMnOiByZXR1cm4gdGhpcy52YWxpZGF0b3IoKS5yZWdleCh2YWx1ZSk7XG4gICAgICBjYXNlICdsZW5ndGgnOlxuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICAgIGNhc2UgJzwnOiByZXR1cm4gdGhpcy52YWxpZGF0b3IoKS5tYXgodmFsdWUgLSAxKTtcbiAgICAgICAgICBjYXNlICc8PSc6IHJldHVybiB0aGlzLnZhbGlkYXRvcigpLm1heCh2YWx1ZSk7XG4gICAgICAgICAgY2FzZSAnPic6IHJldHVybiB0aGlzLnZhbGlkYXRvcigpLm1pbih2YWx1ZSArIDEpO1xuICAgICAgICAgIGNhc2UgJz49JzogcmV0dXJuIHRoaXMudmFsaWRhdG9yKCkubWluKHZhbHVlKTtcbiAgICAgICAgICBjYXNlICc9PSc6IHJldHVybiB0aGlzLnZhbGlkYXRvcigpLmxlbmd0aCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyB1bmtub3duKHsgb3BlcmF0aW9uLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBFbWFpbCA9IHtcbiAgdmFsaWRhdG9yKCkgeyByZXR1cm4gam9pLnN0cmluZygpLmVtcHR5KCcnKS5lbWFpbCgpIH0sXG4gIGdldFJ1bGVWYWxpZGF0b3Iob3B0cykge1xuICAgIHJldHVybiBTdHJpbmcuZ2V0UnVsZVZhbGlkYXRvcihvcHRzKTtcbiAgfVxufTtcbiJdfQ==