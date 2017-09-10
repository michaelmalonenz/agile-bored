import {Container} from 'aurelia-framework'

import {IssueService} from '../services/issues'
import {StatusService} from '../services/statuses'

export class ServiceFactory {

  getIssueService () {
    return Container.instance.get(IssueService)
  }

  getStatusService () {
    return Container.instance.get(StatusService)
  }
}
