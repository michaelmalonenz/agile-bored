import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {SecuritySettings} from './security-settings'
import {UserService} from '../services/users'

const KEY_ENTER = 13

@inject(Router, UserService)
export class Login {
  constructor (router, userService) {
    this.router = router
    this.userService = userService
    this.username = ''
    this.password = ''
    this.settings = SecuritySettings.instance()
    this.loggingIn = false
    this.loginFailed = false

    this.boundKeyHandler = this._keypressHandler.bind(this)
  }

  activate (params) {
    this.redirectModuleId = params.return || ''
  }

  bind () {
    window.addEventListener('keypress', this.boundKeyHandler)
  }

  unbind () {
    window.removeEventListener('keypress', this.boundKeyHandler)
  }

  _keypressHandler (e) {
    if (e.which === KEY_ENTER) {
      return this.login()
    }
  }

  login () {
    this.settings.initialise(this.username, this.password)
    this.loggingIn = true
    this.userService.me().then((user) => {
      this.settings.user = user
      if (this.redirectModuleId) {
        this.router.navigateToRoute(this.redirectModuleId)
      }
    }).catch(err => {
      this.loggingIn = false
      this.loginFailed = true
    })
  }
}
