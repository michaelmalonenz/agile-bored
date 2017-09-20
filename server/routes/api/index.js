var express = require('express')
var router = express.Router()

require('./issues')(router)
require('./status')(router)
require('./settings')(router)
require('./user')(router)

module.exports = router
