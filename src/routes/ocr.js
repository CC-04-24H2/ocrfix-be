const { Router } = require('express');
const {
  predictHandler, createHandler, getAllHandler, getSingleHandler,
  updateHandler,
} = require('../controllers/ocr.controller');
const { verifyToken } = require('../middlewares/jwt');

const ocrRouter = Router();

ocrRouter.post('/predict', predictHandler);
ocrRouter.post('', verifyToken, createHandler);
ocrRouter.get('', verifyToken, getAllHandler);
ocrRouter.get('/:id', verifyToken, getSingleHandler);
ocrRouter.put('/:id', verifyToken, updateHandler);

module.exports = ocrRouter;
