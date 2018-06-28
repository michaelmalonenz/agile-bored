import {HttpClient} from 'aurelia-http-client'

import {SecuritySettings} from '../security/security-settings'

export class AuthHttpClient extends HttpClient {
  constructor () {
    super()

    this.configure((x) => {
      x.transformers.push((_client, _processor, message) => {
        const security = SecuritySettings.instance()
        message.headers.add('Authorization', security.getAuthorizationHeader())
        if (security.loggedIn) {
          message.headers.add('X-User-Id', security.userId)
        }
      })
    })
  }
}
