/* global btoa */

export class SecuritySettings {
  constructor () {
    this._username = ''
    this._password = ''
    this.confirmed = false
  }

  static instance () {
    return settings
  }

  initialise (username, password) {
    this._username = username
    this._password = password
  }

  confirmSettings () {
    this.confirmed = true
  }

  get username () {
    return this._username
  }

  get password () {
    return this._password
  }

  getAuthorizationHeader () {
    return `Basic ${btoa(`${this.username}:${this.password}`)}`
  }
}

const settings = new SecuritySettings()
