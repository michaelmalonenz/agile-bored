import {HttpClient} from 'aurelia-http-client'
import {Issue} from '../issue'

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

  _issueReviver (key, value) {
    if (key !== '' && typeof value === 'object') {
      return new Issue(value)
    }
    return value
  }
}
