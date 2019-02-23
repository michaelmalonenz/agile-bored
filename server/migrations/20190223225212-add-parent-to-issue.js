'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('issues', 'parentId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'issues',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('issues', 'parentId')
  }
}
