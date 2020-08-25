import { inject } from 'aurelia-framework'
import { AuthHttpClient } from './auth-http-client'
import {Status} from '../models/status'
import {User} from '../models/user'
import {Epic} from '../models/epic'
import {IssueType} from '../models/issue-type'

@inject(AuthHttpClient)
export class EpicService {

  constructor (http) {
    this._http = http
  }

  async get (epicId) {
    const res = await this._http
      .createRequest(`/api/epics/${epicId}`)
      .asGet()
      .withReviver(this._epicReviver)
      .send()

    return res.content
  }

  async searchEpics (searchTerm) {
    const res = await this._http
      .createRequest('/api/epics/search')
      .asGet()
      .withParams({ search: searchTerm })
      .withReviver(this._epicReviver)
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

  _epicReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && isNaN(key)) {
      if (key === 'issueStatus') {
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
        return new User(value)
      } else if (key === 'comment') {
        return value
      } else if (key === 'issues') {
        return value
      }
    }
    return value
  }
}
