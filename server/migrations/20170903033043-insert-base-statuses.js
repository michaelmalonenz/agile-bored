'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('issue_statuses', [
      { name: 'Todo' },
      { name: 'Blocked' },
      { name: 'In Progess' },
      { name: 'Review' },
      { name: 'Test' },
      { name: 'Done' }
    ])
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('issue_statuses')
  }
}
