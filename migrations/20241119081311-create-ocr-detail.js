'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OcrDetails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      prediction: {
        allowNull: false,
        type: Sequelize.CHAR
      },
      probability: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      actual: {
        allowNull: false,
        type: Sequelize.CHAR
      },
      ocr_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'OcrPredictions',
          key: 'id',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OcrDetails');
  }
};