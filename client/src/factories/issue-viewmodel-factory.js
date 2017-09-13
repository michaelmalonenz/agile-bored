import {DialogService} from 'aurelia-dialog'
import {Container} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'

import {Issue} from '../issue'
import {IssueService} from '../services/issues'

export class IssueViewModelFactory {
  create (issueDTO) {
    const container = Container.instance
    return new Issue(issueDTO,
      container.get(DialogService),
      container.get(IssueService),
      container.get(EventAggregator))
  }
}
