import {HttpClient} from 'aurelia-http-client'
import {Issue} from '../models/issue'

export class IssueService {
  constructor () {
    this._http = new HttpClient()
  }

  findAll () {
    return this._http
      .createRequest('/api/issues')
      .asGet()
      .withReviver(this._issueReviver)
      .send()
      .then(res => {
        return res.content
      })
  }

  create (issue) {
    return this._http.post('/api/issue', issue).then(res => {
      return res.content
    })
  }

  update (issue) {
    return this._http.put(`/api/issue/${issue.id}`, issue).then(res => {
      return res.content
    })
  }

  delete (issue) {
    return this._http.delete(`/api/issue/${issue.id}`)
  }

  _issueReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      return new Issue(value)
    }
    return value
  }
}
