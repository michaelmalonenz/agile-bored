import {HttpClient} from 'aurelia-http-client'

import {SecuritySettings} from '../security/security-settings'

export class AuthHttpClient extends HttpClient {
  constructor () {
    super()

    this.configure((x) => {
      x.transformers.push((client, processor, message) => {
        message.headers.add('Authorization',
          SecuritySettings.instance().getAuthorizationHeader())
      })
    })
  }
}
