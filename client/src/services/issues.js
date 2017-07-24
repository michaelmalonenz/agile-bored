import {HttpClient} from 'aurelia-http-client'

export class IssueService {
  constructor() {
    this._http = new HttpClient()
  }

  findAll() {
    return this._http.get('/api/issues').then(res => {
      return res.content
    })
  }
}