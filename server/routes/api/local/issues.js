const db = require('../../../models')
const IssueViewModel = require('../../../viewmodels/issue')

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
      const result = []
      for (let issue of issues) {
        result.push(IssueViewModel.createFromLocal(issue.dataValues))
      }
      res.send(result)
    })
    .catch(err => res.status(500).send(err.message))
  },
  get: function (req, res) {
    return db.Issue.findById(req.params.issueId)
      .then(issue => IssueViewModel.createFromLocal(issue))
      .then(result => res.send(result))
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
    return db.Issue.update(req.body, { where: { id: req.params.issueId } }).then(() => {
      res.send(req.body)
    })
  },
  assign: function (req, res) {
    res.sendStatus(200)
  }
}
