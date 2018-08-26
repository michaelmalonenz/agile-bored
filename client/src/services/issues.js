import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'
import {Issue} from '../models/issue'
import {Status} from '../models/status'
import {User} from '../models/user'
import {Epic} from '../models/epic'
import {IssueType} from '../models/issue-type'

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

  async get (issueId) {
    const res = await this._http
      .createRequest(`/api/issue/${issueId}`)
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

  async getIssuesByEpic () {
    const res = await this._http
      .createRequest('/api/issues-by-epic')
      .asGet()
      .withReviver(this._epicReviver)
      .send()

    let epics = []
    for (let epic of res.content) {
      epics.push(new Epic(epic))
    }
    return epics
  }

  async getStandUpIssues () {
    const res = await this._http
      .createRequest('/api/issues/standup')
      .asGet()
      .withParams({ offset: new Date().getTimezoneOffset() })
      .withReviver(this._issueReviver)
      .send()

      return res.content
  }

  async assign (issueId, assignee) {
    const res = await this._http
      .createRequest(`/api/issue/${issueId}/assign`)
      .asPut()
      .withContent(assignee)
      .send()

    return res.content
  }

  async getBacklogIssues () {
    const res = await this._http
      .createRequest('/api/issues/backlog')
      .asGet()
      .withReviver(this._issueReviver)
      .send()

    return res.content
  }

  _issueReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
      if (key === 'IssueStatus') {
        return new Status(value)
      } else if (key === 'assignee') {
        return new User(value)
      } else if (key === 'epic') {
        return new Epic(value)
      } else if (key === 'issueType') {
        return new IssueType(value)
      } else if (key === 'children') {
        return value
      } else if (key === 'avatarUrls') {
        return value
      } else if (key === 'comments') {
        return value
      }
      return new Issue(value)
    }
    return value
  }

  _epicReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
      if (key === 'IssueStatus') {
        return new Status(value)
      } else if (key === 'assignee') {
        return new User(value)
      } else if (key === 'epic') {
        return new Epic(value)
      } else if (key === 'issueType') {
        return new IssueType(value)
      } else if (key === 'children') {
        return value
      } else if (key === 'avatarUrls') {
        return value
      } else if (key === 'comments') {
        return value
      } else if (key === 'author') {
        return value
      } else if (key === 'comment') {
        return value
      } else if (key === 'issues') {
        return value
      }
    }
    return value
  }
}
