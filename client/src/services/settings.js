import {inject} from 'aurelia-framework'
import {HttpClient} from 'aurelia-http-client'

import {Settings} from '../models/settings'

@inject(HttpClient)
export class SettingsService {
  constructor(http) {
    this._http = http
  }

  async get () {
    const res = await this._http
      .createRequest('/api/settings')
      .asGet()
      .withReviver(this._settingsReviver)
      .send()

    return res.content
  }

  async update (settings) {
    const res = await this._http
      .createRequest('/api/settings')
      .asPut()
      .withContent(settings)
      .withReviver(this._settingsReviver)
      .send()

    return res.content
  }

  _settingsReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      return new Settings(value)
    }
    return value
  }
}
