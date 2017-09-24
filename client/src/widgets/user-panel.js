import {customElement} from 'aurelia-framework'

import {SecuritySettings} from '../security/security-settings'

@customElement('user-panel')
export class UserPanel {

  constructor () {
    this.securitySettings = SecuritySettings.instance()
  }

  get currentUser () {
    return this.securitySettings.user
  }

  get avatar () {
    return this.currentUser.avatarUrls['24x24']
  }

}
