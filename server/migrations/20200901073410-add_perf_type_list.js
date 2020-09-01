module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('settings', 'perfStatsIssueTypes',
      { type: Sequelize.TEXT })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('settings', 'perfStatsIssueTypes')
  }
}
