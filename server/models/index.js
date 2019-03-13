'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '/../config/config.json'))[env]
let db = {}

let sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: env === 'development' ? console.log : false,
  operatorsAliases: false
})

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.Issue.belongsTo(db.IssueStatus, { foreignKey: 'statusId' })
db.Issue.belongsTo(db.IssueType, { foreignKey: 'typeId' })
db.Issue.belongsTo(db.User, { as: 'reporter', foreignKey: 'reporterId' })
db.Issue.belongsTo(db.User, { as: 'assignee', foreignKey: 'assigneeId' })
db.Issue.hasMany(db.Comment, { as: 'comments', foreignKey: 'issueId' })
db.Issue.hasMany(db.Issue, { as: 'children', foreignKey: 'parentId' })
db.Issue.hasMany(db.ChangeLog, { as: 'changelog', foreignKey: 'issueId' })

db.Comment.belongsTo(db.User, { foreignKey: 'authorId', as: 'author' })

db.ChangeLog.belongsTo(db.User, { foreignKey: 'authorId', as: 'author' })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
