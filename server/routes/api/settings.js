const db = require('../../models')

module.exports = function (router) {
  router.get('/settings', function (req, res) {
    db.Settings.findOne().then((settings) => {
      return res.send(settings)
    })
  })

  router.put('/settings', function (req, res) {
    db.Settings.upsert(req.body).then(() => {
      return res.send(req.body)
    })
  })
}
