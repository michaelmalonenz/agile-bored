'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('settings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      jiraUrl: Sequelize.STRING(1024),
      useJira: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('settings')
  }
}
