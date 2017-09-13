module.exports = function (router) {
  router.get('/settings', function (req, res) {
    return res.send({})
  })

  router.put('/settings', function (req, res) {
    return res.send(req.body)
  })
}
