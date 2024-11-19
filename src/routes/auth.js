const { Router } = require('express');
const { registerHandler } = require('../controllers/auth.controller');

const authRouter = Router();

authRouter.post('/register', registerHandler);

module.exports = authRouter;
