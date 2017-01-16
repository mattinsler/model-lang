'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joiBrowser = require('joi-browser');

var _joiBrowser2 = _interopRequireDefault(_joiBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var joi = _joiBrowser2.default.extend({
  name: 'string',
  base: _joiBrowser2.default.string(),
  language: {
    contains: 'must contain {{q}}'
  },
  rules: [{
    name: 'contains',
    params: {
      q: _joiBrowser2.default.string().required()
    },
    validate: function validate(params, value, state, options) {
      if (value.indexOf(params.q) === -1) {
        return this.createError('string.contains', { value: value, q: params.q }, state, options);
      }

      return value;
    }
  }]
});

exports.default = joi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qb2kuanMiXSwibmFtZXMiOlsiam9pIiwiZXh0ZW5kIiwibmFtZSIsImJhc2UiLCJzdHJpbmciLCJsYW5ndWFnZSIsImNvbnRhaW5zIiwicnVsZXMiLCJwYXJhbXMiLCJxIiwicmVxdWlyZWQiLCJ2YWxpZGF0ZSIsInZhbHVlIiwic3RhdGUiLCJvcHRpb25zIiwiaW5kZXhPZiIsImNyZWF0ZUVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxxQkFBSUMsTUFBSixDQUFXO0FBQ3JCQyxRQUFNLFFBRGU7QUFFckJDLFFBQU0scUJBQUlDLE1BQUosRUFGZTtBQUdyQkMsWUFBVTtBQUNSQyxjQUFVO0FBREYsR0FIVztBQU1yQkMsU0FBTyxDQUFDO0FBQ05MLFVBQU0sVUFEQTtBQUVOTSxZQUFRO0FBQ05DLFNBQUcscUJBQUlMLE1BQUosR0FBYU0sUUFBYjtBQURHLEtBRkY7QUFLTkMsWUFMTSxvQkFLR0gsTUFMSCxFQUtXSSxLQUxYLEVBS2tCQyxLQUxsQixFQUt5QkMsT0FMekIsRUFLa0M7QUFDdEMsVUFBSUYsTUFBTUcsT0FBTixDQUFjUCxPQUFPQyxDQUFyQixNQUE0QixDQUFDLENBQWpDLEVBQW9DO0FBQ2xDLGVBQU8sS0FBS08sV0FBTCxDQUFpQixpQkFBakIsRUFBb0MsRUFBRUosWUFBRixFQUFTSCxHQUFHRCxPQUFPQyxDQUFuQixFQUFwQyxFQUE0REksS0FBNUQsRUFBbUVDLE9BQW5FLENBQVA7QUFDRDs7QUFFRCxhQUFPRixLQUFQO0FBQ0Q7QUFYSyxHQUFEO0FBTmMsQ0FBWCxDQUFaOztrQkFxQmVaLEciLCJmaWxlIjoiam9pLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEpvaSBmcm9tICdqb2ktYnJvd3Nlcic7XG5cbmNvbnN0IGpvaSA9IEpvaS5leHRlbmQoe1xuICBuYW1lOiAnc3RyaW5nJyxcbiAgYmFzZTogSm9pLnN0cmluZygpLFxuICBsYW5ndWFnZToge1xuICAgIGNvbnRhaW5zOiAnbXVzdCBjb250YWluIHt7cX19J1xuICB9LFxuICBydWxlczogW3tcbiAgICBuYW1lOiAnY29udGFpbnMnLFxuICAgIHBhcmFtczoge1xuICAgICAgcTogSm9pLnN0cmluZygpLnJlcXVpcmVkKClcbiAgICB9LFxuICAgIHZhbGlkYXRlKHBhcmFtcywgdmFsdWUsIHN0YXRlLCBvcHRpb25zKSB7XG4gICAgICBpZiAodmFsdWUuaW5kZXhPZihwYXJhbXMucSkgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUVycm9yKCdzdHJpbmcuY29udGFpbnMnLCB7IHZhbHVlLCBxOiBwYXJhbXMucSB9LCBzdGF0ZSwgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1dXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgam9pO1xuIl19