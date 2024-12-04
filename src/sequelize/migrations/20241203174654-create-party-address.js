'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('party_addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      party_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'parties',
          key: 'id'
        }
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      landmark: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('party_addresses');
  }
};