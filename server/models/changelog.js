module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ChangeLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    issueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'issues',
        key: 'id'
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    field: DataTypes.STRING(255),
    oldValue: DataTypes.TEXT,
    newValue: DataTypes.TEXT,
    timestamp: DataTypes.DATE
  }, {
    tableName: 'changelog',
    timestamps: false
  })
}
