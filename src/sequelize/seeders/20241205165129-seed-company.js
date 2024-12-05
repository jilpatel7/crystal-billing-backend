'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('companies', [{
      id: 1,
      name: 'The Initial Company',
      email: 'initial.company@gmail.com',
      password: 'Dev@123',
      office_phone: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
    }], {
      updateOnDuplicate: ['id', 'email',],
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  }
};
