const { Router } = require('express');
const { predictHandler, createHandler, getAllHandler } = require('../controllers/ocr.controller');
const { verifyToken } = require('../middlewares/jwt');

const ocrRouter = Router();

ocrRouter.post('/predict', predictHandler);
ocrRouter.post('', verifyToken, createHandler);
ocrRouter.get('', verifyToken, getAllHandler);

module.exports = ocrRouter;
