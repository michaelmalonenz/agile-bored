module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    externalId: DataTypes.STRING(255),
    username: DataTypes.STRING(255),
    displayName: DataTypes.STRING(255),
    avatar: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'users'
  }, {
    indexes: [{
      unique: true,
      fields: ['externalId']
    }]
  })
}
