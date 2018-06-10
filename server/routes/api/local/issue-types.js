const db = require('../../../models')
const IssueTypeViewModel = require('../../../viewmodels/issue-type')

module.exports = {
  getIssueTypes: function (req, res) {
    return db.IssueType.findAll().then(issueTypes => {
      const result = []
      for (let issueType of issueTypes) {
        result.push(IssueTypeViewModel.createFromLocal(issueType))
      }
      res.send(result)
    })
    .catch(err => res.setStatus(500).send(err))
  }
}
