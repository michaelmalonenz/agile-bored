var express = require('express')
var router = express.Router()

require('./issues')(router)
require('./status')(router)
require('./settings')(router)
require('./user')(router)
require('./comments')(router)
require('./issue-types')(router)
require('./estimation')(router)
require('./projects')(router)
require('./reports')(router)

module.exports = router
