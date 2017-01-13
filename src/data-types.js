import util from 'util';
import joi from './joi';

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
      console.log('string', property, value);
      switch (property) {
        case 'contains': return validator.contains(value);
        case 'matches': return validator.regex(value);
      }
    }

    return validator;
  }
};

export const Email = {
  type: 'string',
  validator() { return joi.string().email() }
};
