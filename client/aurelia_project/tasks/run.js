import gulp from 'gulp'
import browserSync from 'browser-sync'
import { CLIOptions } from 'aurelia-cli'
import build from './build'
import watch from './watch'

let serve = gulp.series(
  build,
  done => {
    browserSync({
      online: false,
      open: false,
      port: 5000,
      logLevel: 'silent',
      proxy: 'localhost:5000'
    }, function (err, bs) {
      if (err) return done(err)
      let urls = bs.options.get('urls').toJS()
      log(`Application Available At: ${urls.local}`)
      log(`BrowserSync Available At: ${urls.ui}`)
      done()
    })
  }
)

function log (message) {
  console.log(message) // eslint-disable-line no-console
}

function reload () {
  log('Refreshing the browser')
  browserSync.reload()
}

let run

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    done => {
      watch(reload)
      done()
    }
  )
} else {
  run = serve
}

export default run
