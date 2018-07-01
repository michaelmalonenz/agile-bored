const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const db = require('./models')

function loginSuccess (accessToken, refreshToken, extraParams, profile, done) {
  db.User.findOrCreate({
    where: { externalId: profile.id },
    defaults: {
      displayName: profile.displayName,
      username: profile.nickname,
      avatar: profile.picture,
      externalId: profile.id
    }
  })
  .spread((user, created) => done(null, user))
  .catch(err => {
    console.log(err)
    done(err)
  })
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
      clientID: config.cliendID,
      domain: config.domain,
      redirectUri: config.callbackURL,
      responseType: 'code',
      audience: 'https://' + config.domain + '/userinfo',
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
