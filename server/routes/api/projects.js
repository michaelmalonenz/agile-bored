const localProjects = require('./local/projects')
const jiraProjects = require('./jira/projects')

module.exports = function (router) {
  router.get('/projects/:projectId', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraProjects.get(req, res)
    }
    return localProjects.get(req, res)
  })
}
