module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', { id: Sequelize.INTEGER })
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
