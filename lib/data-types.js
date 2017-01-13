'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Email = exports.String = exports.Date = exports.Boolean = undefined;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _joi = require('./joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Boolean = exports.Boolean = {
  type: 'boolean',
  validator: function validator() {
    return _joi2.default.boolean();
  }
};

var Date = exports.Date = {
  type: 'date',
  validator: function validator() {
    return _joi2.default.date();
  }
};

var String = exports.String = {
  type: 'string',
  validator: function validator() {
    return _joi2.default.string();
  },
  addRule: function addRule(validator, _ref) {
    var constraint = _ref.constraint,
        property = _ref.property,
        type = _ref.type,
        value = _ref.value;

    if (constraint) {
      switch (constraint) {
        case 'length':
          switch (type) {
            case 'lt':
              return validator.max(value - 1);
            case 'lte':
              return validator.max(value);
            case 'gt':
              return validator.min(value + 1);
            case 'gte':
              return validator.min(value);
            case 'equal':
              return validator.length(value);
          }
          break;
      }
    } else if (property) {
      console.log('string', property, value);
      switch (property) {
        case 'contains':
          return validator.contains(value);
        case 'matches':
          return validator.regex(value);
      }
    }

    return validator;
  }
};

var Email = exports.Email = {
  type: 'string',
  validator: function validator() {
    return _joi2.default.string().email();
  }
};