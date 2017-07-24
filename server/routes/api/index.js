var express = require('express')
var router = express.Router()

require('./issues')(router)

module.exports = router
