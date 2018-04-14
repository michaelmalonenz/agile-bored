import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'
import {User} from '../models/user'

@inject(AuthHttpClient)
export class UserService {
  constructor(http) {
    this._http = http
  }

  async me () {
    const res = await this._http
      .createRequest('/api/me')
      .asGet()
      .withReviver(this._userReviver)
      .send()

    return res.content
  }

  _userReviver (key, value) {
    if (key === '' && value != null && typeof value === 'object') {
      return new User(value)
    }
    return value
  }
}
