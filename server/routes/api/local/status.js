const db = require('../../../models')

module.exports = {
  getStatuses: function (req, res) {
    return db.IssueStatus.findAll().then(statuses => {
      res.send(statuses)
    })
  }
}
