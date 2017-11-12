const localStatuses = require('./local/status')
const jiraStatuses = require('./jira/status')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/statuses', function (req, res) {
    return settings.useJira().then(useJira => {
      if (useJira) {
        return jiraStatuses.getStatuses(req, res)
      } else {
        return localStatuses.getStatuses(req, res)
      }
    })
  })
}
