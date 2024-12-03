const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const { v7: uuidv7 } = require('uuid');
const Response = require('../dto/response/default.response');
const OcrValidator = require('../validators/OcrValidator');
const CloudStorage = require('../utils/CloudStorage');
const { OcrPrediction, OcrDetail, sequelize } = require('../models');

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
      mlRes.data = mlRes.data.map((d) => ({ probability: d.probabilty, prediction: d.prediction }));

      const response = Response.defaultOK('Get prediction success', { ocr: mlRes.data });
      return res.status(response.code).json(response);
    } catch (error) {
      const response = Response.defaultInternalError(error.message);
      return res.status(response.code).json(response);
    }
  });
};

const createHandler = (req, res) => {
  const uploadForm = upload.single('image');

  uploadForm(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const response = Response.defaultBadRequest(err.message);
      return res.status(response.code).json(response);
    }

    const { body, file } = req;
    const { decodedToken } = res.locals;
    const ocrValidator = new OcrValidator(body);

    const bodyError = ocrValidator.validateCreate();
    if (bodyError.length !== 0) {
      const response = Response.defaultBadRequest(bodyError);
      return res.status(response.code).json(response);
    }

    const id = uuidv7();

    try {
      // upload to gcs
      const cloudStorage = new CloudStorage();
      let ext = file.originalname.split('.');
      ext = ext[ext.length - 1];
      const filename = `${id}.${ext}`;
      await cloudStorage.uploadFile(file.buffer, filename);

      // upload to sql
      await sequelize.transaction(async (t) => {
        const details = body.ocrs;
        const ocrDetails = details.map((detail) => ({ id: uuidv7(), ocr_id: id, ...detail }));

        await OcrPrediction.create({
          id,
          image_path: filename,
          user_id: decodedToken.id,
        }, { transaction: t });

        await OcrDetail.bulkCreate(ocrDetails, { transaction: t });
      });
    } catch (error) {
      const response = Response.defaultBadRequest(error.message);
      return res.status(response.code).json(response);
    }

    const response = Response.defaultOK('OCRfix created');
    return res.status(response.code).json(response);
  });
};

const getAllHandler = async (req, res) => {
  const { decodedToken } = res.locals;

  try {
    let ocrs = await OcrPrediction.findAll({
      attributes: ['id', ['image_path', 'image'], ['createdAt', 'created_at']],
      where: {
        user_id: decodedToken.id,
      },
    });

    ocrs = ocrs.map((ocr) => ({
      ...ocr.dataValues,
      image: `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${ocr.dataValues.image}`,
    }));

    const response = Response.defaultOK('Success get OCRfix', { ocrs });
    return res.status(response.code).json(response);
  } catch (error) {
    const response = Response.defaultInternalError(error.message);
    return res.status(response.code).json(response);
  }
};

const getSingleHandler = async (req, res) => {
  const { decodedToken } = res.locals;
  const { id } = req.params;

  try {
    const ocr = await OcrPrediction.findOne({
      attributes: ['user_id', ['image_path', 'image'], ['createdAt', 'created_at']],
      where: {
        id,
      },
    });

    if (!ocr) {
      const response = Response.defaultNotFound([`record with id ${id} not found`]);
      return res.status(response.code).json(response);
    }

    if (ocr.user_id !== decodedToken.id) {
      const response = Response.defaultForbidden(['no access to resource']);
      return res.status(response.code).json(response);
    }

    const ocrDetails = await OcrDetail.findAll({
      attributes: ['id', 'prediction', 'probability', 'actual'],
      where: {
        ocr_id: id,
      },
    });

    const response = Response.defaultOK('success get OCRfix details', {
      created_at: ocr.dataValues.created_at,
      image: `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${ocr.dataValues.image}`,
      ocrDetails,
    });
    return res.status(response.code).json(response);
  } catch (error) {
    const response = Response.defaultInternalError(error.message);
    return res.status(response.code).json(response);
  }
};

const updateHandler = async (req, res) => {
  const { decodedToken } = res.locals;
  const { id } = req.params;
  const { body } = req;

  const ocrValidator = new OcrValidator(body);
  const bodyError = ocrValidator.validateUpdate();
  if (bodyError.length !== 0) {
    const response = Response.defaultBadRequest(bodyError);
    return res.status(response.code).json(response);
  }

  try {
    const ocr = await OcrPrediction.findOne({
      attributes: ['user_id'],
      where: {
        id,
      },
    });

    if (!ocr) {
      const response = Response.defaultNotFound([`record with id ${id} not found`]);
      return res.status(response.code).json(response);
    }

    if (ocr.user_id !== decodedToken.id) {
      const response = Response.defaultForbidden(['no access to resource']);
      return res.status(response.code).json(response);
    }

    const updatePromises = body.ocrs.map((o) => OcrDetail
      .update({
        actual: o.actual,
      }, {
        where: {
          id: o.detail_id,
          ocr_id: id,
        },
      }));
    await Promise.all(updatePromises);

    const response = Response.defaultOK('Update OCRfix success');
    return res.status(response.code).json(response);
  } catch (error) {
    const response = Response.defaultInternalError(error.message);
    return res.status(response.code).json(response);
  }
};

const deleteHandler = async (req, res) => {
  const { decodedToken } = res.locals;
  const { id } = req.params;

  try {
    const ocr = await OcrPrediction.findOne({
      attributes: ['user_id'],
      where: {
        id,
      },
    });

    if (!ocr) {
      const response = Response.defaultNotFound([`record with id ${id} not found`]);
      return res.status(response.code).json(response);
    }

    if (ocr.user_id !== decodedToken.id) {
      const response = Response.defaultForbidden(['no access to resource']);
      return res.status(response.code).json(response);
    }

    await sequelize.transaction(async (t) => {
      await OcrDetail.destroy({
        where: {
          ocr_id: id,
        },
      }, { transaction: t });
      await OcrPrediction.destroy({
        where: {
          id,
        },
      }, { transaction: t });
    });

    const response = Response.defaultOK('Delete OCRfix success');
    return res.status(response.code).json(response);
  } catch (error) {
    const response = Response.defaultInternalError(error.message);
    return res.status(response.code).json(response);
  }
};

module.exports = {
  predictHandler,
  createHandler,
  getAllHandler,
  getSingleHandler,
  updateHandler,
  deleteHandler,
};
