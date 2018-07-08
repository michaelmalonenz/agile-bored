'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'jiraId', {
      type: Sequelize.STRING(255)
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'jiraId')
  }
}
