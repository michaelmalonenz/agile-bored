import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'
import {Issue} from '../models/issue'
import {Status} from '../models/status'
import {User} from '../models/user'

@inject(AuthHttpClient)
export class IssueService {

  constructor (http) {
    this._http = http
  }

  async findAll () {
    const res = await this._http
      .createRequest('/api/issues')
      .asGet()
      .withReviver(this._issueReviver)
      .send()

      return res.content
  }

  async create (issue) {
    const res = await this._http.post('/api/issue', issue)
    return res.content
  }

  async update (issue) {
    const res = await this._http.put(`/api/issue/${issue.id}`, issue)
    return res.content
  }

  async updateStatus (issueId, statusId) {
    const res = await this._http.put(`/api/issue/${issueId}/status/${statusId}`)
    return res.content
  }

  async delete (issue) {
    await this._http.delete(`/api/issue/${issue.id}`)
  }

  async search (searchTerm) {
    const res = await this._http
      .createRequest('/api/issues/search')
      .asGet()
      .withParams({ search: searchTerm })
      .withReviver(this._issueReviver)
      .send()

    return res.content
  }

  _issueReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      if (key === 'IssueStatus') {
        return new Status(value)
      } else if (key === 'assignee') {
        return new User(value)
      }
      return new Issue(value)
    }
    return value
  }
}
