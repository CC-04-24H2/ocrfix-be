const { Router } = require('express');
const { registerHandler, loginHandler } = require('../controllers/auth.controller');

const authRouter = Router();

authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);

module.exports = authRouter;
