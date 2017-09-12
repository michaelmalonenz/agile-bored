import {inject} from 'aurelia-framework'
import {HttpClient} from 'aurelia-http-client'

import {JiraService} from './service'
import {Issue} from '../../models/issue'

@inject(HttpClient)
export class IssueJiraService extends JiraService {

  constructor (http) {
    super(http)
  }

  findAll () {
    return Promise.resolve([])
  }

  create (issue) {
    return Promise.resolve(new Issue())
  }

  update (issue) {
    return Promise.resolve(new Issue())
  }

  updateStatus (issueId, statusId) {
    return Promise.resolve(new Issue())
  }

  delete (issue) {
    return Promise.resolve()
  }

  _issueReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      return new Issue(value)
    }
    return value
  }
}
