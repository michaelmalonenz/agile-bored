import {customElement} from 'aurelia-framework'

import {SecuritySettings} from '../security/security-settings'

@customElement('user-panel')
export class UserPanel {

  constructor () {
    this.securitySettings = SecuritySettings.instance()
  }

  get loggedIn () {
    return this.securitySettings.loggedIn
  }

  get currentUser () {
    return this.securitySettings.user
  }

  get avatarUrl () {
    if (this.currentUser && this.currentUser.avatarUrl)
      return this.currentUser.avatarUrl

    return null
  }

}
