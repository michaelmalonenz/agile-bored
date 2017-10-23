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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}
