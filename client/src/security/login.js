import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {parseQueryString} from 'aurelia-path'

import {SecuritySettings} from './security-settings'
import {UserService} from '../services/users'

import { KEY_CODES } from '../utils/key-codes'


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
    this.redirectFragment = ''
    this.redirectParams = null

    this.boundKeyHandler = this._keypressHandler.bind(this)
  }

  activate (params) {
    this.redirectFragment = params.return || ''
  }

  bind () {
    window.addEventListener('keypress', this.boundKeyHandler)
  }

  unbind () {
    window.removeEventListener('keypress', this.boundKeyHandler)
  }

  _keypressHandler (e) {
    if (e.which === KEY_CODES.ENTER) {
      return this.login()
    }
  }

  login () {
    this.settings.initialise(this.username, this.password)
    this.loggingIn = true
    return this.userService.me().then((user) => {
      this.settings.user = user
      return this.router.navigate(this.redirectFragment)
    }).catch(err => {
      console.log(err)
      this.loggingIn = false
      this.loginFailed = true
    })
  }
}
