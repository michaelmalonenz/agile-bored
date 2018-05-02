/* global btoa */

export class SecuritySettings {
  constructor () {
    this._username = ''
    this._password = ''
    this.loggedIn = false
  }

  static instance () {
    return settings
  }

  initialise (username, password) {
    this._username = username
    this._password = password
    this.loggedIn = false
  }

  set user (value) {
    this.loggedIn = true
    this._user = value
  }

  get user () {
    return this._user
  }

  get username () {
    return this._username
  }

  get password () {
    return this._password
  }

  get userId () {
    return this.user.id
  }

  getAuthorizationHeader () {
    return `Basic ${btoa(`${this.username}:${this.password}`)}`
  }
}

const settings = new SecuritySettings()
