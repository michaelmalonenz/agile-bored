module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    issueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'issues',
        key: 'id'
      }
    },
    body: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'comments'
  })
}
