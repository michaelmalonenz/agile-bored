'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('settings', 'jiraRapidBoardId',
      { type: Sequelize.INTEGER })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('settings', 'jiraRapidBoardId')
  }
}
