class Validator {
  constructor(body) {
    this.body = body;
  }

  static getErrorList(validationResult) {
    if (validationResult.error !== undefined) {
      const errorList = validationResult.error.details.map((detail) => detail.message);
      return errorList;
    }
    return [];
  }
}

module.exports = Validator;
