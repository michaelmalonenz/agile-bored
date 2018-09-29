import environment from './environment'
import { PLATFORM } from 'aurelia-pal'
import { UserService } from './services/users'
import { SecuritySettings } from './security/security-settings'
import 'bootstrap'

export async function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
      config.useDefaults()
      config.settings.startingZIndex = 1050
    })
    .plugin('aurelia-dragula')
    .feature('resources')
    .feature('widgets')
    .feature('issues')
    .globalResources([
      './status-column',
      './nav-bar'
    ])

  if (environment.debug) {
    aurelia.use.developmentLogging()
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing')
  }

  await aurelia.start()
  return aurelia.container.get(UserService).me()
    .then(user => {
      SecuritySettings.instance().user = user
    })
    .catch(_err => {})
    .then(() => aurelia.setRoot())
}
