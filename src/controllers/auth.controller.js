const { v7: uuidv7 } = require('uuid');
const { User } = require('../models');
const AuthValidator = require('../validators/AuthValidator');
const Response = require('../dto/response/default.response');
const { createBcrypt } = require('../utils/bcrypt');

const registerHandler = async (req, res) => {
  const { body } = req;
  const authValidator = new AuthValidator(body);

  const bodyError = authValidator.validateRegister();
  if (bodyError.length !== 0) {
    const response = Response.defaultBadRequest(bodyError);
    return res.status(response.code).json(response);
  }

  const id = uuidv7();
  const password = await createBcrypt(body.password);
  try {
    await User.create({
      id,
      name: body.name,
      email: body.email,
      password,
    });
  } catch (error) {
    const errorList = error.errors.map((err) => err.message);
    const response = Response.defaultBadRequest(errorList);
    return res.status(response.code).json(response);
  }

  const response = Response.defaultCreated('Register success');
  return res.status(response.code).json(response);
};

module.exports = { registerHandler };
