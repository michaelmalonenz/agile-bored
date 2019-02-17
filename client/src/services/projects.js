import { inject } from 'aurelia-framework'

import { AuthHttpClient } from './auth-http-client'
import { Project } from '../models/project'

@inject(AuthHttpClient)
export class ProjectService {
  constructor (http) {
    this._http = http
  }

  async getProject (id) {
    const res = await this._http
      .createRequest(`/api/projects/${id}`)
      .asGet()
      .withReviver(this._projectReviver)
      .send()

    return res.content
  }

  _projectReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
      return new Project(value)
    }
    return value
  }
}
