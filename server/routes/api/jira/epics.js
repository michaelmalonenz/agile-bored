const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const EpicViewModel = require('../../../viewmodels/epic')

module.exports = {
  get: function (req, res) {
    const options = jiraRequestBuilder.agile(`/epic/${req.params.epicId}`, req)
    return request(options)
      .then(result => {
        res.send(EpicViewModel.createFromJira(result))
      })
      .catch(err => res.status(502).send(JSON.stringify(err)))
  },
  searchEpics: function (req, res) {
    const term = (req.query.search || '').toLowerCase()
    return getEpics(req.settings.jiraRapidBoardId, req)
      .then(epics => {
        const results = []
        for (let epic of epics) {
          if ((epic.name && epic.name.toLowerCase().includes(term)) ||
              (epic.summary && epic.summary.toLowerCase().includes(term)) ||
              epic.key.toLowerCase().includes(term)) {
            results.push(EpicViewModel.createFromJira(epic))
          }
        }
        res.send(results)
      })
      .catch(err => res.status(502).send(err))
  }
}

function getEpics (jiraRapidBoardId, req, startAt = 0) {
  const url = `/board/${jiraRapidBoardId}/epic?done=false&startAt=${startAt}`
  const options = jiraRequestBuilder.agile(url, req)
  return request(options)
    .then(response => {
      if (!response.isLast) {
        return getEpics(jiraRapidBoardId, req, startAt + response.maxResults)
          .then(values => {
            return values.concat(response.values)
          })
      } else {
        return response.values
      }
    })
}
