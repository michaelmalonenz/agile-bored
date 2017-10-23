const db = require('../../models')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/settings', function (req, res) {
    db.Settings.findOne().then((settings) => {
      return res.send(settings)
    })
  })

  router.put('/settings', function (req, res) {
    let newSettings = req.body
    db.Settings.upsert(newSettings).then(() => {
      settings.updateSettings(newSettings)
      return res.send(newSettings)
    })
  })
}
