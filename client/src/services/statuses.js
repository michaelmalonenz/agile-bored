import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'
import {Status} from '../models/status'

@inject(AuthHttpClient)
export class StatusService {

  constructor(http) {
    this._http = http
    this.statuses = null
  }

  async findAllForProject (forBoard) {
    if (this.statuses == null || forBoard) {
      const res = await this._http
        .createRequest('/api/statuses')
        .withParams({board: forBoard})
        .asGet()
        .withReviver(this._statusReviver)
        .send()
      if (forBoard) {
        return res.content
      }
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
