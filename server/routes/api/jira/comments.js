const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const CommentViewModel = require('../../../viewmodels/comment')
const MarkdownToJira = require('../../../viewmodels/markdown-to-jira')

module.exports = {
  getCommentsForIssue: function (req, res) {
    const options = jiraRequestBuilder.jira(`/issue/${req.params.issueId}/comment`, req)
    return request(options)
      .then(result => {
        const results = []
        for (let comment of result.comments) {
          results.push(CommentViewModel.createFromJira(comment))
        }
        res.send(results)
      })
      .catch(err => res.status(502).send(JSON.stringify(err)))
  },
  addComment: function (req, res) {
    const options = jiraRequestBuilder.jira(`/issue/${req.params.issueId}/comment`, req, 'POST')
    options.body = MarkdownToJira.convert(req.body)
    return request(options)
      .then(result => res.send(CommentViewModel.createFromJira(result)))
      .catch(err => res.status(502).send(err))
  }
}
