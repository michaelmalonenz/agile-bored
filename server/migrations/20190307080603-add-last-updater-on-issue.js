'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('issues', 'latestEditorId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('issues', 'latestEditorId')
  }
}
