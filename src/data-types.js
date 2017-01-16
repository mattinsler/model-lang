import util from 'util';
import joi from './joi';

function unknown({ operation, property, value }) {
  let message = `Unknown rule String.${property}`;
  if (operation) {
    message += `.${operation}`
  }
  return new Error(message);
}

export const Boolean = {
  validator() { return joi.boolean() },
  getRuleValidator({ operation, property, value }) {
    throw unknown({ operation, property, value });
  }
};

export const Date = {
  validator() { return joi.date() },
  getRuleValidator({ operation, property, value }) {
    throw unknown({ operation, property, value });
  }
};

export const Timestamp = {
  validator() { return joi.date().timestamp() },
  getRuleValidator({ operation, property, value }) {
    throw unknown({ operation, property, value });
  }
};

export const String = {
  validator() { return joi.string().empty('') },
  getRuleValidator({ operation, property, value }) {
    switch (property) {
      case 'contains': return this.validator().contains(value);
      case 'matches': return this.validator().regex(value);
      case 'length':
        switch (operation) {
          case '<': return this.validator().max(value - 1);
          case '<=': return this.validator().max(value);
          case '>': return this.validator().min(value + 1);
          case '>=': return this.validator().min(value);
          case '==': return this.validator().length(value);
        }
    }

    throw unknown({ operation, property, value });
  }
};

export const Email = {
  validator() { return joi.string().empty('').email() },
  getRuleValidator(opts) {
    return String.getRuleValidator(opts);
  }
};
