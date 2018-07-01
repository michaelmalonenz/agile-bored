const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const db = require('./models')

function loginSuccess (accessToken, refreshToken, extraParams, profile, done) {
  console.log(profile)
  // Change to find or create - possibly update values?
  db.User.findOne({ where: { externalId: profile.id } })
    .then(user => done(null, user))
    .catch(err => done(err))
}
const config = require('./oauth-config')
passport.use(new Auth0Strategy(config, loginSuccess))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (userId, done) {
  db.User.findOne({ where: { id: userId } })
    .then(localUser => done(null, localUser))
    .catch(err => done(err))
})

module.exports = (app) => {
  app.get('/auth/callback',
    passport.authenticate('auth0', { failureRedirect: '/login' }),
    function (req, res) {
      if (!req.user) {
        throw new Error('user not logged in')
      }
      res.redirect('/')
    }
  )

  app.get('/login',
    passport.authenticate('auth0', {
      scope: 'openid profile email'
    }),
    (req, res) => res.redirect('/'))

  app.get('/auth/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/auth/logout-complete', (req, res) => {
    req.session.destroy(err => {
      if (err) throw err
      res.redirect('/')
    })
  })
}
