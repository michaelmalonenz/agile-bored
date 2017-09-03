import 'babel-runtime'
import 'bootstrap'

export function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog')
    .plugin('aurelia-dragula')
    .feature('widgets')

  aurelia.start().then(() => aurelia.setRoot())
}
