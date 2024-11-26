const { Router } = require('express');
const authRouter = require('./auth');
const ocrRouter = require('./ocr');

const router = Router();

router.use('/auth', authRouter);
router.use('/ocr', ocrRouter);

module.exports = router;
