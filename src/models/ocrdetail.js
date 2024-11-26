'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OcrDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OcrDetail.belongsTo(models.OcrPrediction, {
        foreignKey: 'ocrId',
      })
    }
  }
  OcrDetail.init({
    prediction: {
      allowNull: false,
      type: DataTypes.CHAR,
    },
    probability: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    actual: {
      allowNull: false,
      type: DataTypes.CHAR,
    },
    ocr_id: {
      allowNull: false,
      type: DataTypes.UUID,
    }
  }, {
    sequelize,
    modelName: 'OcrDetail',
  });
  return OcrDetail;
};