/* So, I'm going to fold and decide that Epics aren't a special
 * case of issue, but their own thing.
 */
const localEpics = require('./local/epics')
const jiraEpics = require('./jira/epics')

module.exports = function (router) {
  router.get('/epics/search', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraEpics.searchEpics(req, res)
    }
    return localEpics.searchEpics(req, res)
  })

  router.get('/epics/:epicId', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraEpics.get(req, res)
    }
    return localEpics.get(req, res)
  })
}
