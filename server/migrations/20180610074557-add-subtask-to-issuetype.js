'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('issue_type', 'subtask', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('issue_type', 'subtask')
  }
}
