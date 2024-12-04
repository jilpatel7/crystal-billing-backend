'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoice-history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      party_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      total_amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      paid_amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoice-history');
  }
};