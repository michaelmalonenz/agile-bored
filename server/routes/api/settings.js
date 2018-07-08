const db = require('../../models')

module.exports = function (router) {
  router.get('/settings', function (req, res) {
    res.send(req.settings)
  })

  router.put('/settings', function (req, res) {
    let newSettings = req.body
    return db.Settings.upsert(newSettings).then(() => {
      res.send(newSettings)
    })
  })
}
