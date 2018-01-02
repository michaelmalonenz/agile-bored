import { RedirectToRoute } from 'aurelia-router'

import {SecuritySettings} from './security-settings'

export class AuthorizeStep {

  run (navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      var isLoggedIn = SecuritySettings.instance().loggedIn
      if (!isLoggedIn) {
        const moduleId = navigationInstruction.config.moduleId
        return next.cancel(new RedirectToRoute('login', { return: moduleId }))
      }
    }

    return next()
  }
}
