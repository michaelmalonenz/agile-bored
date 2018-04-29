'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      externalId: Sequelize.STRING(255),
      displayName: Sequelize.STRING(255),
      username: Sequelize.STRING(255),
      avatar: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
    .then(() => {
      queryInterface.addIndex('users', {
        fields: ['externalId'],
        unique: true,
        type: 'UNIQUE'
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  }
}
