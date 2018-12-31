import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'

@inject(AuthHttpClient)
export class EstimationService {
  constructor (http) {
    this._http = http
  }

  async getEstimateForEpic (epicId) {
    const res = await this._http
      .createRequest(`/api/estimate/${epicId}`)
      .asGet()
      .send()

    return res.content
  }
}
