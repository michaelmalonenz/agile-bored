'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('settings', 'jiraEpicField',
      { type: Sequelize.STRING(255) })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('settings', 'jiraEpicField')
  }
}
