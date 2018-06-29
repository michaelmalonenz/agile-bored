import environment from './environment'

export async function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-dialog')
    .plugin('aurelia-dragula')
    .feature('resources')
    .feature('widgets')
    .feature('issues')
    .globalResources('./status-column')

  if (environment.debug) {
    aurelia.use.developmentLogging()
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing')
  }

  await aurelia.start()
  await aurelia.setRoot()
}
