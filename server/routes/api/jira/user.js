const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const db = require('../../../models')
const url = require('url')

module.exports = {
  me: function (req, res) {
    return jiraRequestBuilder.jira('/myself', req)
      .then(options => request(options))
      .then(user => {
        return request({
          uri: url.parse(user.avatarUrls['24x24'], true).query.d,
          encoding: null,
          headers: {
            'Authorization': req.get('Authorization')
          }
        })
        .then(avatar => {
          return db.User.findOrBuild({
            where: { externalId: user.accountId }
          })
          .spread((userObj) => {
            userObj.set({
              externalId: user.accountId,
              displayName: user.displayName,
              username: user.name,
              avatar: avatar.toString('base64')
            })
            res.send(userObj)
            return userObj.save()
          })
        }).catch(err => {
          console.log(err)
          return res.sendStatus(503)
        })
      })
  }
}
