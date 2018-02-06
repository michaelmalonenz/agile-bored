import environment from './environment'
import {PLATFORM} from 'aurelia-framework'

export function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-dialog')
    .plugin('aurelia-dragula')
    .feature('widgets')
    .globalResources(PLATFORM.moduleName('./issue-with-children'))

  if (environment.debug) {
    aurelia.use.developmentLogging()
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing')
  }

  aurelia.start().then(() => aurelia.setRoot())
}
