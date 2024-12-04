'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
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
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        }
      },
      no_of_lots: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      jagad_no: {
        type: Sequelize.STRING,
      },
      received_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      delivered_at: {
        type: Sequelize.DATE
      },
      delivered_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'company_staffs',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
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
    await queryInterface.dropTable('orders');
  }
};