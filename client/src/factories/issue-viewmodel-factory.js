import {DialogService} from 'aurelia-dialog'
import {Container} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'

import {Issue} from '../issue'
import {IssueService} from '../services/issues'

export class IssueViewModelFactory {
  create (issueDTO) {
    const children = []
    for (let child of issueDTO.children) {
      children.push(this._createViewModel(child))
    }
    issueDTO.children = children
    return this._createViewModel(issueDTO)
  }

  _createViewModel (dto) {
    const container = Container.instance
    return new Issue(dto,
      container.get(DialogService),
      container.get(IssueService),
      container.get(EventAggregator))
  }
}
