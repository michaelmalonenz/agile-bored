var path = require('path')
require('envoodoo')(path.join(__dirname, '.env'))

var express = require('express')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

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

app.set('port', process.env.PORT || 5000)

require('./routes/index')(app)

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port)
})

module.exports = app
