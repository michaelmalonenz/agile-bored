'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('issue_type', [
      { name: 'Story', colour: 'green' },
      { name: 'Task', colour: 'goldenrod' },
      { name: 'Bug', colour: 'red' },
      { name: 'Epic', colour: 'purple' }
    ]).then(() => {
      return queryInterface.bulkUpdate('issues', { typeId: 1 })
    })
  },

  down: function (queryInterface, Sequelize) {
  }
}
