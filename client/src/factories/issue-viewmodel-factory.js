import {DialogService} from 'aurelia-dialog'
import {Container} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {Issue} from '../issue'
import {ServiceFactory} from './service-factory'

export class IssueViewModelFactory {
  create (issueDTO) {
    const container = Container.instance
    const serviceFactory = container.get(ServiceFactory)
    return new Issue(issueDTO,
      container.get(DialogService),
      container.get(serviceFactory.getIssueService()),
      container.get(EventAggregator))
  }
}
