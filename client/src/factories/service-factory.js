import {Container} from 'aurelia-framework'

import {IssueService} from '../services/issues'
import {StatusService} from '../services/statuses'

import {IssueJiraService} from '../services/jira/issues'
import {StatusJiraService} from '../services/jira/statuses'

const useJira = false

export class ServiceFactory {

  getIssueService () {
    if (useJira) {
      return Container.instance.get(IssueJiraService)
    }
    return Container.instance.get(IssueService)
  }

  getStatusService () {
    if (useJira) {
      return Container.instance.get(StatusJiraService)
    }
    return Container.instance.get(StatusService)
  }
}
