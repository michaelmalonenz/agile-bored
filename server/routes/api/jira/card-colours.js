const jiraRequestBuilder = require('./jira-request')
const cachedRequest = require('./cached-request')

module.exports = {
  getCardColours (req) {
    const url = `/cardcolors/${req.settings.rapidBoardId}/strategy/issuetype`
    const options = jiraRequestBuilder.greenhopper(url, req)
    return cachedRequest(options)
      .then(res => res.cardColors)
  }
}
