const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const CommentViewModel = require('../../../viewmodels/comment')

module.exports = {
  getCommentsForIssue: function (req, res) {
    return jiraRequestBuilder.jira(`/issue/${req.params.issueId}/comment`, req)
      .then(options => request(options))
      .then(result => {
        const results = []
        for (let comment of result.comments) {
          results.push(CommentViewModel.createFromJira(comment))
        }
        res.send(results)
      })
      .catch(err => res.status(502).send(JSON.stringify(err)))
  }
}
