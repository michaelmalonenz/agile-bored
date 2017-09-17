module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Settings',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      jiraUrl: DataTypes.TEXT,
      useJira: DataTypes.BOOLEAN
    }, {
      tableName: 'settings'
    })
}
