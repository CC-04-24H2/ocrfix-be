const { Router } = require('express');
const { registerHandler, loginHandler, getRefreshTokenHandler } = require('../controllers/auth.controller');

const authRouter = Router();

authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/refresh', getRefreshTokenHandler);

module.exports = authRouter;
