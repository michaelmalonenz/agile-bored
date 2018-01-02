const db = require('../../models')
const localIssues = require('./local/issues')
const jiraIssues = require('./jira/issues')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/issues', function (req, res) {
    return settings.useJira().then(useJira => {
      if (useJira) {
        return jiraIssues.findAllIssues(req, res)
      } else {
        return localIssues.findAllIssues(req, res)
      }
    })
  })

  router.get('/issues/search', function (req, res) {
    return settings.useJira().then(useJira => {
      if (useJira) {
        return jiraIssues.search(req, res)
      } else {
        return localIssues.search(req, res)
      }
    })
  })

  router.post('/issue', function (req, res) {
    return db.Issue.create(req.body).then(issue => {
      res.send(issue)
    })
  })

  router.put('/issue/:id', function (req, res) {
    return db.Issue.update(req.body, { where: { id: req.params.id } }).then(() => {
      res.send(req.body)
    })
  })

  router.put('/issue/:issueId/status/:statusId', function (req, res) {
    return db.Issue.update(
      { statusId: req.params.statusId },
      { where: { id: req.params.issueId } }).then(issue => {
        res.sendStatus(200)
      })
  })

  router.delete('/issue/:id', function (req, res) {
    return db.Issue.destroy({ where: { id: req.params.id } })
  })
}
