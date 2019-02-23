'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('issue_type', [
      { name: 'Sub-task', colour: '', subtask: true },
      { name: 'Sub-bug', colour: 'red', subtask: true }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('issue_type', {
      where: {
        subtask: true
      }
    })
  }
}
