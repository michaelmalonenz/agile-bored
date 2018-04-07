const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

let statusCache = []
let cardColours = []

module.exports = {
  cacheStatuses (statuses) {
    statusCache = statuses
  },
  getCachedStatus (statusId) {
    return Promise.resolve(statusCache.find(s => s.id === statusId))
  },
  getCardColours (req) {
    if (cardColours.length !== 0) {
      return Promise.resolve(cardColours)
    } else {
      return jiraRequestBuilder.greenhopper('/cardcolors/89/strategy/issuetype', req)
        .then(options => request(options))
        .then(res => {
          cardColours = res.cardColors
          return cardColours
        })
    }
  }
}
