const Joi = require('joi');
const Validator = require('./Validator');

class OcrValidator extends Validator {
  validateCreate() {
    if (!this.body.ocrs) {
      return ['ocrs must be included'];
    }

    this.body.ocrs = JSON.parse(this.body.ocrs);

    const arr = Joi.object({
      prediction: Joi.string()
        .min(1)
        .max(1)
        .required(),
      probability: Joi.number()
        .required(),
      actual: Joi.string()
        .min(1)
        .max(1)
        .required(),
    });

    const schema = Joi.object({
      ocrs: Joi.array()
        .items(arr)
        .required(),
    });

    const result = schema.validate(this.body);
    return Validator.getErrorList(result);
  }

  validateUpdate() {
    const arr = Joi.object({
      detail_id: Joi.string()
        .required(),
      actual: Joi.string()
        .min(1)
        .max(1)
        .required(),
    });

    const schema = Joi.object({
      ocrs: Joi.array()
        .items(arr)
        .required(),
    });

    const result = schema.validate(this.body);
    return Validator.getErrorList(result);
  }
}

module.exports = OcrValidator;
