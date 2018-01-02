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

  get avatar () {
    if (this.currentUser && this.currentUser.avatarUrls)
      return this.currentUser.avatarUrls['24x24']

    return null
  }

}
