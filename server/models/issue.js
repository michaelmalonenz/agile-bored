module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Issue',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      description: DataTypes.TEXT,
      title: DataTypes.TEXT,
      rank: DataTypes.INTEGER,
      statusId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'issue_status',
          key: 'id'
        }
      }
    }, {
      tableName: 'issues'
    })
}
