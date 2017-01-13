import Joi from 'joi';
import util from 'util';

const joi = Joi.extend({
  name: 'string',
  base: Joi.string(),
  language: {
    contains: 'needs to contain {{q}}'
  },
  rules: [{
    name: 'contains',
    params: {
      q: Joi.string().required()
    },
    validate(params, value, state, options) {
      if (value.indexOf(params.q) === -1) {
        return this.createError('string.contains', value, state, options);
      }

      return value;
    }
  }]
});

export const Boolean = {
  type: 'boolean',
  validator() { return joi.boolean() }
};

export const Date = {
  type: 'date',
  validator() { return joi.date() }
};

export const String = {
  type: 'string',
  validator() { return joi.string() },
  addRule(validator, { constraint, property, type, value }) {
    if (constraint) {
      switch (constraint) {
        case 'length':
          switch (type) {
            case 'lt': return validator.max(value - 1);
            case 'lte': return validator.max(value);
            case 'gt': return validator.min(value + 1);
            case 'gte': return validator.min(value);
            case 'equal': return validator.length(value);
          }
          break;
      }
    } else if (property) {
      switch (property) {
        case 'contains': return validator.contains(value);
      }
    }

    return validator;
  }
};

export const Email = {
  type: 'string',
  validator() { return joi.string().email() }
};
