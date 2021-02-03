'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('scraps', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'scrap_user_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('scraps', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'scrap_post_id',
      references: {
        table: 'posts',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('scraps', 'scrap_user_id');
    await queryInterface.removeConstraint('scraps', 'scrap_post_id');
  }
};
