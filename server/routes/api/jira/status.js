const jiraRequestBuilder = require('./jira-request')
const StatusViewModel = require('../../../viewmodels/status')
const settings = require('../../../settings')
const localCache = require('./local-cache')
const cachedRequest = require('./cached-request')

module.exports = {
  getStatuses: function (req, res) {
    return settings.jiraProjectName()
      .then(jiraProjectName =>
        this.retrieveStatuses(req, jiraProjectName))
      .then(result => res.send(result))
      .catch(err => res.status(502).send(err))
  },
  retrieveStatuses: function (req, jiraProjectName) {
    const url = `project/${jiraProjectName}/statuses`
    return jiraRequestBuilder.jira(url, req)
      .then(options => cachedRequest(options))
      .then(statuses => {
        const result = []
        for (let statusList of statuses) {
          if (statusList.name === 'Story') {
            for (let status of statusList.statuses) {
              result.push(StatusViewModel.createFromJira(status))
            }
          }
        }
        return result
      })
      .then(statusViewModels => orderStatuses(statusViewModels, req))
      .then(result => {
        localCache.cacheStatuses(result)
        return result
      })
  }
}

function orderStatuses (statusViewModels, req) {
  return settings.jiraRapidBoardId()
    .then(rapidBoardId => {
      const url = `board/${rapidBoardId}/configuration`
      return jiraRequestBuilder.agile(url, req)
    })
    .then(options => cachedRequest(options))
    .then(config => {
      const columns = config.columnConfig.columns

      statusViewModels.sort((a, b) => {
        return columns.findIndex(column => column.statuses.findIndex(status => status.id === a.id) !== -1) -
               columns.findIndex(column => column.statuses.findIndex(status => status.id === b.id) !== -1)
      })

      const backlogCol = columns.find(col => col.name === 'Backlog')
      if (backlogCol) {
        const backlogIndex = statusViewModels.findIndex(status => {
          return backlogCol.statuses.find(s => s.id === status.id)
        })
        if (backlogIndex >= 0) {
          statusViewModels.splice(backlogIndex, 1)
        }
      }

      return statusViewModels
    })
}
