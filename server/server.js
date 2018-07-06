require('dotenv').config()
const path = require('path')

const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const PgSession = require('connect-pg-simple')(session)

const env = process.env.NODE_ENV || 'development'
const dbConfig = require('./config/config')[env]
const { Pool } = require('pg')
const pgPool = new Pool({
  user: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database
})

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(favicon('../client/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  store: new PgSession({
    pool: pgPool
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, '../client')))
app.use(express.static(path.join(__dirname, '../client/scripts')))

app.set('port', process.env.PORT || 5000)

require('./auth')(app)
require('./routes/index')(app)

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port)
})

module.exports = app
