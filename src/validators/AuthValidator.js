const Joi = require('joi');
const Validator = require('./Validator');

class AuthValidator extends Validator {
  validateRegister() {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .max(150)
        .required(),
      name: Joi.string()
        .max(100)
        .required(),
      password: Joi.string()
        .min(8)
        .max(100)
        .required(),
      password_repeat: Joi.ref('password'),
    }).with('password', 'password_repeat');

    const result = schema.validate(this.body);
    return Validator.getErrorList(result);
  }

  validateLogin() {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .max(150)
        .required(),
      password: Joi.string()
        .min(8)
        .max(100)
        .required(),
    });

    const result = schema.validate(this.body);
    return Validator.getErrorList(result);
  }

  validateRefresh() {
    const schema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const result = schema.validate(this.body);
    return Validator.getErrorList(result);
  }
}

module.exports = AuthValidator;
