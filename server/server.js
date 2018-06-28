const path = require('path')
require('envoodoo')(path.join(__dirname, '.env'))

const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const db = require('./models')

function loadSettings (req, res, next) {
  const userId = req.get('X-User-Id')
  if (userId !== 'undefined') {
    return db.Settings.findOrCreate({ where: { userId: userId }, defaults: { userId: userId } })
      .spread((settings, created) => {
        req.settings = settings
        next()
      })
  } else {
    next()
  }
}

var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(favicon('../client/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../client')))
app.use(express.static(path.join(__dirname, '../client/scripts')))
app.use(loadSettings)

app.set('port', process.env.PORT || 5000)

require('./routes/index')(app)

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port)
})

module.exports = app
