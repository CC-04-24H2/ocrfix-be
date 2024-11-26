const { Router } = require('express');
const { predictHandler, createHandler } = require('../controllers/ocr.controller');
const { verifyToken } = require('../middlewares/jwt');

const ocrRouter = Router();

ocrRouter.post('/predict', predictHandler);
ocrRouter.post('', verifyToken, createHandler);

module.exports = ocrRouter;
