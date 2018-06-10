module.exports = function (sequelize, DataTypes) {
  return sequelize.define('IssueType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(64),
    colour: DataTypes.STRING(64),
    subtask: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'issue_type'
  })
}
