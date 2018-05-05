const localComments = require('./local/comments')
const jiraComments = require('./jira/comments')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/issue/:issueId/comments', function (req, res) {
    return settings.useJira().then(useJira => {
      if (useJira) {
        return jiraComments.getCommentsForIssue(req, res)
      } else {
        return localComments.getCommentsForIssue(req, res)
      }
    })
  })
}
