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
      },
      assigneeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      reporterId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    }, {
      tableName: 'issues'
    })
}
