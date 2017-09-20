/* global btoa */

export class SecuritySettings {
  constructor () {
    this._username = ''
    this._password = ''
    this.isSet = false
  }

  static instance () {
    return settings
  }

  initialise (username, password) {
    this._username = username
    this._password = password
    this.isSet = true
  }

  get username () {
    return this._username
  }

  get password () {
    return this._password
  }

  get authorizationHeader () {
    return `Basic ${btoa(`${this._username}:${this._password}`)}`
  }
}

const settings = new SecuritySettings()
