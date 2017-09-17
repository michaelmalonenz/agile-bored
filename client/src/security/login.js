import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {SecuritySettings} from './security-settings'

@inject(Router)
export class Login {
  constructor (router) {
    this.router = router
    this.username = ''
    this.password = ''
    this.settings = SecuritySettings.instance()
  }

  login () {
    this.settings.initialise(this.username, this.password)
    console.log('routing...')
    this.router.navigate('/board')
  }
}
