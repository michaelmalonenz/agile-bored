const db = require('../../models')

module.exports = function (router) {
  router.get('/statuses', function (req, res) {
    return db.IssueStatus.findAll().then(statuses => {
      res.send(statuses)
    })
  })
}
