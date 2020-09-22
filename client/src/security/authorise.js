import { RedirectToRoute } from 'aurelia-router'

import { SecuritySettings } from './security-settings'

export class AuthorizeStep {
  run (instruction, next) {
    if (instruction.getAllInstructions().some(i => i.config.auth)) {
      var isLoggedIn = SecuritySettings.instance().loggedIn
      if (!isLoggedIn) {
        const currentUrl = instruction.fragment + (instruction.queryString ? `?${instruction.queryString}` : '')
        return next.cancel(new RedirectToRoute('login', { return: currentUrl }))
      }
    }

    return next()
  }
}
