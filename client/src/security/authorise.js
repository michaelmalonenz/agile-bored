import {Redirect} from 'aurelia-router'

import {SecuritySettings} from './security-settings'

export class AuthorizeStep {

  run (navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      var isLoggedIn = SecuritySettings.instance().loggedIn
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'))
      }
    }

    return next()
  }
}
