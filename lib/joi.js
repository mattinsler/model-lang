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
    contains: 'needs to contain {{q}}'
  },
  rules: [{
    name: 'contains',
    params: {
      q: _joiBrowser2.default.string().required()
    },
    validate: function validate(params, value, state, options) {
      if (value.indexOf(params.q) === -1) {
        return this.createError('string.contains', value, state, options);
      }

      return value;
    }
  }]
});

exports.default = joi;