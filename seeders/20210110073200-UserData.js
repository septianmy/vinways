'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.bulkInsert('users', [{
          fullName: 'Admin',
          email: 'admin@vinways.com',
          password: '$2b$10$/fwyIsrTmyIXV2/0bY5OoudF2Goi.XNZVnK9Qs03f5NYhKVRBqEcO',
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('users', null, {});
  }
};
