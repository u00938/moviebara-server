'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // field 추가
    await queryInterface.addColumn('posts', 'user_id', Sequelize.INTEGER);
    await queryInterface.addColumn('posts', 'movie_id', Sequelize.INTEGER);

    // foreign key 연결
    await queryInterface.addConstraint('posts', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('posts', {
      fields: ['movie_id'],
      type: 'foreign key',
      name: 'movie_id',
      references: {
        table: 'movies',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('posts', 'user_id');
    await queryInterface.removeColumn('posts', 'user_id');
    await queryInterface.removeConstraint('posts', 'movie_id');
    await queryInterface.removeColumn('posts', 'movie_id');
  }
};
