const router = require('express').Router()

const ensureLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect('/login')
  } else {
    next()
  }
}

const ensureApiLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).send('Unauthorized')
  }
}

router.get('/',
  ensureLoggedIn,
  (req, res) => res.render('index.html'))

module.exports = function (app) {
  app.use('/', router)
  app.use('/api', ensureApiLoggedIn, require('./api/index'))
}
