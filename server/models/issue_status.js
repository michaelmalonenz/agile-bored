module.exports = function (sequelize, DataTypes) {
  return sequelize.define('IssueStatus', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(255)
  }, {
    tableName: 'issue_statuses'
  })
}
