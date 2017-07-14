'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('issue_status',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING(255)
      }).then(() => {
        return queryInterface.createTable('issue',
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
                model: 'issue_status',
                key: 'id'
              }
            }
          })
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropAllTables()
  }
}
