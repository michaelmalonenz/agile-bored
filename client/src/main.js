import 'babel-runtime'
import 'bootstrap'

export function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog')
    .plugin('aurelia-dragula')
    .globalResources([
      './src/side-bar',
      './src/top-shelf'
    ])

  aurelia.start().then(() => aurelia.setRoot())
}
