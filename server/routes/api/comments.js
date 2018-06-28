const localComments = require('./local/comments')
const jiraComments = require('./jira/comments')

module.exports = function (router) {
  router.get('/issue/:issueId/comments', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraComments.getCommentsForIssue(req, res)
    }
    return localComments.getCommentsForIssue(req, res)
  })

  router.post('/issue/:issueId/comment', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraComments.addComment(req, res)
    }
    return localComments.addComment(req, res)
  })
}
