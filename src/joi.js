import Joi from 'joi-browser';

const joi = Joi.extend({
  name: 'string',
  base: Joi.string(),
  language: {
    contains: 'must contain {{q}}'
  },
  rules: [{
    name: 'contains',
    params: {
      q: Joi.string().required()
    },
    validate(params, value, state, options) {
      if (value.indexOf(params.q) === -1) {
        return this.createError('string.contains', { value, q: params.q }, state, options);
      }

      return value;
    }
  }]
});

export default joi;
