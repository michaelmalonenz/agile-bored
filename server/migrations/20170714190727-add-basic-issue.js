'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('issue_statuses',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING(255),
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }).then(() => {
        return queryInterface.createTable('issues',
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            title: Sequelize.TEXT,
            description: Sequelize.TEXT,
            rank: Sequelize.INTEGER,
            statusId: {
              type: Sequelize.INTEGER,
              references: {
                model: 'issue_statuses',
                key: 'id'
              }
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
          })
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropAllTables()
  }
}
