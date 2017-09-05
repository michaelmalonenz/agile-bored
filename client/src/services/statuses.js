import {inject} from 'aurelia-framework'
import {HttpClient} from 'aurelia-http-client'

import {Status} from '../models/status'

@inject(HttpClient)
export class StatusService {

  constructor(http) {
    this._http = http
  }

  findAllForProject (projectId) {
    return this._http
      .createRequest('/api/statuses')
      .asGet()
      .withReviver(this._statusReviver)
      .send()
      .then(res => {
        return res.content
      })
  }

  _statusReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      return new Status(value)
    }
    return value
  }
}