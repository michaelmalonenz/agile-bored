module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Settings',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      jiraUrl: DataTypes.TEXT,
      jiraProjectName: DataTypes.TEXT,
      jiraRapidBoardId: DataTypes.INTEGER,
      useJira: DataTypes.BOOLEAN,
      groupByEpic: DataTypes.BOOLEAN,
      jiraEpicField: DataTypes.STRING(255)
    }, {
      tableName: 'settings'
    })
}
