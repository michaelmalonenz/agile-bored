const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const db = require('../../../models')

module.exports = {
  me: function (req, res) {
    return jiraRequestBuilder.jira('/myself', req)
      .then(options => request(options))
      .then(user => {
        return request({
          uri: user.avatarUrls['24x24'],
          encoding: null,
          headers: {
            'Authorization': req.get('Authorization')
          }
        })
        .then(avatar => {
          return db.User.upsert({
            externalId: user.accountId,
            displayName: user.displayName,
            username: user.name,
            avatar: avatar.toString('base64')
          })
          .then(() => {
            return db.User.findOne({
              where: { externalId: user.accountId }
            })
          })
          .then(result => res.send(result))
        })
      }).catch(err => {
        console.log(err)
        return res.sendStatus(503)
      })
  }
}
