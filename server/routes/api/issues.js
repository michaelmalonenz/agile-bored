const db = require('../../models')
const localIssues = require('./local/issues')
const jiraIssues = require('./jira/issues')

module.exports = function (router) {
  router.get('/issues', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.findAllIssues(req, res)
    }
    return localIssues.findAllIssues(req, res)
  })

  router.get('/issues-by-epic', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.issuesByEpic(req, res)
    }
    return localIssues.issuesByEpic(req, res)
  })

  router.get('/issue/:issueId', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.get(req, res)
    }
    return localIssues.get(req, res)
  })

  router.get('/issues/search', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.search(req, res)
    }
    return localIssues.search(req, res)
  })

  router.get('/issues/standup', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.standup(req, res)
    }
    return localIssues.standup(req, res)
  })

  router.get('/issues/backlog', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.backlog(req, res)
    }
    return localIssues.backlog(req, res)
  })

  router.post('/issue', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.create(req, res)
    }
    return localIssues.create(req, res)
  })

  router.put('/issue/:issueId', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.update(req, res)
    }
    return localIssues.update(req, res)
  })

  router.put('/issue/:issueId/assign', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.assign(req, res)
    }
    return localIssues.assign(req, res)
  })

  router.put('/issue/:issueId/status/:statusId', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.updateStatus(req, res)
    }
    return localIssues.updateStatus(req, res)
  })

  router.delete('/issue/:issueId', function (req, res) {
    return db.Issue.destroy({ where: { id: req.params.issueId } })
  })

  router.get('/epics/search', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.searchEpics(req, res)
    }
    return localIssues.searchEpics(req, res)
  })

  router.get('/issue/:issueId/subtasks', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.getSubtasks(req, res)
    }
    return localIssues.getSubtasks(req, res)
  })

  router.get('/issue/:issueId/changelog', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssues.getChangeLog(req, res)
    }
    return localIssues.getChangeLog(req, res)
  })
}
