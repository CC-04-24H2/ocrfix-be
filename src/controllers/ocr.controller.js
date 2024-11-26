const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const Response = require('../dto/response/default.response');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const predictHandler = (req, res) => {
  const uploadForm = upload.single('image');

  uploadForm(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const response = Response.defaultBadRequest(err.message);
      return res.status(response.code).json(response);
    }

    try {
      const image = req.file;
      const form = new FormData();
      form.append('file', image.buffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });

      const mlRes = await axios.post(`${process.env.PREDICTION_ENDPOINT}/predict`, form);

      const response = Response.defaultOK('Get prediction success', { ocr: mlRes.data });
      return res.status(response.code).json(response);
    } catch (error) {
      const response = Response.defaultInternalError(error.message);
      return res.status(response.code).json(response);
    }
  });
};

module.exports = { predictHandler };
