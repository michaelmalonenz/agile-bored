'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('settings', 'jiraProjectName',
      { type: Sequelize.TEXT })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('settings', 'jiraProjectName')
  }
}
