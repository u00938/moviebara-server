'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // field 추가
    await queryInterface.addColumn('posts', 'userId', Sequelize.INTEGER);
    await queryInterface.addColumn('posts', 'movieId', Sequelize.INTEGER);

    // foreign key 연결
    await queryInterface.addConstraint('posts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'userId',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('posts', {
      fields: ['movieId'],
      type: 'foreign key',
      name: 'movieId',
      references: {
        table: 'movies',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('posts', 'userId');
    await queryInterface.removeColumn('posts', 'userId');
    await queryInterface.removeConstraint('posts', 'movieId');
    await queryInterface.removeColumn('posts', 'movieId');
  }
};
