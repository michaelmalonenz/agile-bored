'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('issue_type', [
      { name: 'Story', colour: 'green' },
      { name: 'Task', colour: 'goldenrod' },
      { name: 'Bug', colour: 'red' },
      { name: 'Epic', colour: 'purple' }
    ]).then(() => {
      return Sequelize.models.IssueType.findOne({
        where: { name: 'Story' }
      }).then(issueType => {
        return Sequelize.Issue.update({ typeId: issueType.id })
      })
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
