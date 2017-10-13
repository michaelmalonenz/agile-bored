'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('issue_type', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING(64),
      colour: Sequelize.STRING(64),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    }).then(() => {
      return queryInterface.addColumn('issues', 'typeId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'issue_type',
          key: 'id'
        }
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('issue_type')
  }
}
