const { Router } = require('express');
const { predictHandler } = require('../controllers/ocr.controller');

const ocrRouter = Router();

ocrRouter.post('/predict', predictHandler);

module.exports = ocrRouter;
