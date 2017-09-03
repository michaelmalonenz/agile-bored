import 'babel-runtime'
import 'bootstrap'

export function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog')
    .plugin('aurelia-dragula')
    .feature('widgets')
    .globalResources([
      './src/side-bar',
      './src/top-shelf'
    ])

  aurelia.start().then(() => aurelia.setRoot())
}
