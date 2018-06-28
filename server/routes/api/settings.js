const db = require('../../models')

module.exports = function (router) {
  router.get('/settings', function (req, res) {
    if (req.settings) {
      res.send(req.settings)
    } else {
      db.Settings.findOne().then((settings) => {
        res.send(settings)
      })
    }
  })

  router.put('/settings', function (req, res) {
    let newSettings = req.body
    db.Settings.upsert(newSettings).then(() => {
      res.send(newSettings)
    })
  })
}
