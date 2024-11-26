'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OcrPrediction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OcrPrediction.belongsTo(models.User, {
        foreignKey: 'userId',
      })
      OcrPrediction.hasMany(models.OcrDetail, {
        foreignKey: 'ocrId',
      })
    }
  }
  OcrPrediction.init({
    image_path: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    }
  }, {
    sequelize,
    modelName: 'OcrPrediction',
  });
  return OcrPrediction;
};