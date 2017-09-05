var express = require('express')
var router = express.Router()

require('./issues')(router)
require('./status')(router)

module.exports = router
