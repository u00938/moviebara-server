'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('scraps', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'scrapUserId',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('scraps', {
      fields: ['postId'],
      type: 'foreign key',
      name: 'scrapPostId',
      references: {
        table: 'posts',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('scraps', 'scrapUserId');
    await queryInterface.removeConstraint('scraps', 'scrapPostId');
  }
};
