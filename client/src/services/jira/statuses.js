import {inject} from 'aurelia-framework'
import {HttpClient} from 'aurelia-http-client'

import {JiraService} from './service'
import {Status} from '../../models/status'

@inject(HttpClient)
export class StatusJiraService extends JiraService {

  constructor(http) {
    super(http)
  }

  findAllForProject (projectId) {
    return Promise.resolve([])
  }

  _statusReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object') {
      return new Status(value)
    }
    return value
  }

}
