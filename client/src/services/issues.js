import {HttpClient} from 'aurelia-http-client'

export class IssueService {
  constructor () {
    this._http = new HttpClient()
  }

  findAll () {
    return this._http.get('/api/issues').then(res => {
      return res.content
    })
  }

  create (issue) {
    return this._http.post('/api/issue', issue).then(res => {
      return res.content
    })
  }
}
