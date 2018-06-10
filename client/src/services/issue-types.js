import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'
import {IssueType} from '../models/issue-type'

@inject(AuthHttpClient)
export class IssueTypeService {

  constructor(http) {
    this._http = http
    this.issueTypes = null
  }

  async getIssueTypes () {
    if (this.issueTypes == null) {
      const res = await this._http
        .createRequest('/api/issuetypes')
        .asGet()
        .withReviver(this._issueTypeReviver)
        .send()
      this.issueTypes = res.content
    }

    return this.issueTypes
  }

  _issueTypeReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      return new IssueType(value)
    }
    return value
  }
}
