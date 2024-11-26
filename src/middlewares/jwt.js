const jwt = require('jsonwebtoken');
const Response = require('../dto/response/default.response');
const { User } = require('../models');

const createToken = (payload, expiresIn) => {
  const secret = process.env.JWT_SIGNKEY;
  const result = jwt.sign(payload, secret, { expiresIn });
  return result;
};

const verifyToken = async (req, res, next) => {
  const secret = process.env.JWT_SIGNKEY;
  let response;

  let decodedToken;
  let token = req.get('Authorization');
  if (!token) {
    response = Response.defaultBadRequest('token not provided');
    return res.status(response.code).json(response);
  }

  token = token.split(' ');
  if (token.length !== 2 || token[0] !== 'Bearer') {
    response = Response.defaultBadRequest('invalid token format');
    return res.status(response.code).json(response);
  }

  token = token[token.length - 1];

  try {
    decodedToken = jwt.verify(token, secret);
  } catch (error) {
    response = Response.defaultUnauthorized(error.message);
    return res.status(response.code).json(response);
  }

  const user = await User.findByPk(decodedToken.id);

  if (user === null) {
    response = Response.defaultUnauthorized('invalid credentials');
    return res.status(response.code).json(response);
  }
  res.locals.decodedToken = decodedToken;

  return next();
};

module.exports = { createToken, verifyToken };
