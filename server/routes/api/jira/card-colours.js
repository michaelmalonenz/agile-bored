const jiraRequestBuilder = require('./jira-request')
const settings = require('../../../settings')
const cachedRequest = require('./cached-request')

module.exports = {
  getCardColours (req) {
    return settings.jiraRapidBoardId()
      .then(rapidBoardId => {
        const url = `/cardcolors/${rapidBoardId}/strategy/issuetype`
        return jiraRequestBuilder.greenhopper(url, req)
      })
      .then(options => cachedRequest(options))
      .then(res => res.cardColors)
  }
}
