import 'babel-runtime'
import 'bootstrap'

export function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dragula')

  aurelia.start().then(() => aurelia.setRoot())
}
