var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  res.render('index.html')
})

module.exports = function (app) {
  app.use('/', router)
  app.use('/api', require('./api/index'))
}
