'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('settings', 'groupByEpic',
      { type: Sequelize.BOOLEAN })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('settings', 'groupByEpic')
  }
}
