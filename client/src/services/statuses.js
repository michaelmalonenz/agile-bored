import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'
import {Status} from '../models/status'

@inject(AuthHttpClient)
export class StatusService {

  constructor(http) {
    this._http = http
    this.statuses = null
  }

  async findAllForProject () {
    if (this.statuses == null) {
      const res = await this._http
        .createRequest('/api/statuses')
        .asGet()
        .withReviver(this._statusReviver)
        .send()
      this.statuses = res.content
    }

    return this.statuses
  }

  _statusReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      return new Status(value)
    }
    return value
  }
}
