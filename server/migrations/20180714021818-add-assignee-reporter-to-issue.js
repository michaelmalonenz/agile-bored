'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
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
    ]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('issues', 'assigneeId'),
      queryInterface.removeColumn('issues', 'reporterId')
    ]
  }
}
