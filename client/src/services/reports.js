import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'

@inject(AuthHttpClient)
export class ReportsService {
  constructor(http) {
    this._http = http
  }

  async westrum () {
    const res = await this._http
      .createRequest('/api/reports/westrum')
      .asGet()
      .send()

    return res.content
  }

  async epicRemaining(epicId, start, end) {
    const res = await this._http
      .createRequest('/api/reports/epicremaining')
      .asGet()
      .withParams({ epicId, start, end })
      .send()

    return res.content
  }
}
