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
          model: 'issue_statuses',
          key: 'id'
        }
      },
      typeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'issue_type',
          key: 'id'
        }
      }
    }, {
      tableName: 'issues'
    })
}
