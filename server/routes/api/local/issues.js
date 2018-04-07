const db = require('../../../models')

module.exports = {
  findAllIssues: function (req, res) {
    return db.Issue.findAll({
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.IssueStatus,
        required: false
      }, {
        model: db.IssueType,
        required: false
      }],
      where: {
        $or: {
          'statusId': { $eq: null },
          '$IssueStatus.name$': { $ne: 'Done' }
        }
      }
    }).then(issues => {
      res.send(issues)
    })
  },
  search: function (req, res) {
    res.send(200)
  },
  updateStatus: function (req, res) {
    return db.Issue.update(
      { statusId: req.params.statusId },
      { where: { id: req.params.issueId } }).then(issue => {
        res.sendStatus(200)
      })
  },
  update: function (req, res) {
    return db.Issue.update(req.body, { where: { id: req.params.id } }).then(() => {
      res.send(req.body)
    })
  }
}
