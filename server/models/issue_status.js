module.exports = function (sequelize, DataTypes) {
  return sequelize.define('IssueStatus', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(255),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'issue_statuses'
  })
}
