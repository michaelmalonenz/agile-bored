const router = require('express').Router()
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const db = require('../models')

function loginSuccess (accessToken, refreshToken, extraParams, profile, done) {
  // Change to find or create
  db.User.findOne({ where: { externalId: profile.id } })
    .then(user => done(null, user))
}
const config = require('../oauth-config')
passport.use(new Auth0Strategy(config, loginSuccess))

passport.serializeUser(function (user, done) {
  done(null, user.externalId)
})

passport.deserializeUser(function (userId, done) {
  db.User.findOne({ where: { externalId: userId } })
    .then(user => done(null, user))
})

router.get('/auth/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function (req, res) {
    if (!req.user) {
      throw new Error('user null')
    }
    res.redirect('/')
  }
)

router.get('/login',
  passport.authenticate('auth0'),
  (req, res) => res.redirect('/'))

const ensureLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect('/login')
  } else {
    next()
  }
}

router.get('/',
  ensureLoggedIn,
  (req, res) => res.render('index.html'))

module.exports = function (app) {
  app.use('/', router)
  app.use('/api', require('./api/index'))
}
