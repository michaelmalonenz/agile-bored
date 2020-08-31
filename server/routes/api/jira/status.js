const jiraRequestBuilder = require('./jira-request')
const StatusViewModel = require('../../../viewmodels/status')
const cachedRequest = require('./cached-request')

module.exports = {
  getStatuses: function (req, res) {
    return this.retrieveStatuses(req, req.settings.jiraProjectName)
      .then(result => res.send(result))
      .catch(err => res.status(502).send(err))
  },
  retrieveStatuses: function (req, jiraProjectName) {
    const url = `project/${jiraProjectName}/statuses`
    const options = jiraRequestBuilder.jira(url, req)
    return cachedRequest(options)
      .then(statuses => {
        const result = []
        for (let statusList of statuses) {
          if (statusList.name === 'Epic') {
            for (let status of statusList.statuses) {
              result.push(StatusViewModel.createFromJira(status))
            }
          }
        }
        return result
      })
      .then(statusViewModels => orderStatuses(statusViewModels, req))
  }
}

function orderStatuses (statusViewModels, req) {
  const url = `board/${req.settings.jiraRapidBoardId}/configuration`
  const options = jiraRequestBuilder.agile(url, req)
  return cachedRequest(options)
    .then(config => {
      const columns = config.columnConfig.columns

      statusViewModels.sort((a, b) => {
        return columns.findIndex(column => column.statuses.findIndex(status => status.id === a.id) !== -1) -
               columns.findIndex(column => column.statuses.findIndex(status => status.id === b.id) !== -1)
      })

      if (req.query.board === 'true') {
        const backlogCol = columns.find(col => col.name === 'Backlog')
        if (backlogCol) {
          const backlogIndex = statusViewModels.findIndex(status => {
            return backlogCol.statuses.find(s => s.id === status.id)
          })
          if (backlogIndex >= 0) {
            statusViewModels.splice(backlogIndex, 1)
          }
        }
      }

      return statusViewModels
    })
}
