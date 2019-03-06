'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('changelog',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        issueId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'issues',
            key: 'id'
          }
        },
        authorId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        field: Sequelize.STRING(255),
        oldValue: Sequelize.TEXT,
        newValue: Sequelize.TEXT,
        timestamp: Sequelize.DATE
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('changelog')
  }
}
