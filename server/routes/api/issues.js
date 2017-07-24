const db  = require('../../models')

module.exports = function (router) {
  router.get('/issues', function (req, res) {
    return db.Issue.findAll().then(issues => {
      res.send(issues)
    })
  })
}
