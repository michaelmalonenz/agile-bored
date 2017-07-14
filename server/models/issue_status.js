module.exports = function (sequelize, DataTypes) {
  return sequelize.define('issue_status',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING(255)
    })
}
