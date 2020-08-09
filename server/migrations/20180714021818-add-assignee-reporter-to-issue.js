'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('issues', 'assigneeId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }),
      queryInterface.addColumn('issues', 'reporterId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      })
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('issues', 'assigneeId'),
      queryInterface.removeColumn('issues', 'reporterId')
    ])
  }
}
