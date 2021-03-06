import { DialogService } from 'aurelia-dialog'
import { Container } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

import { Issue } from '../issues/issue'
import { IssueService } from '../services/issues'

import { AssigneeCache } from '../utils/assignees-cache'
import { User } from '../models/user'

export class IssueViewModelFactory {
  static create (issueDTO) {
    const children = []
    if (issueDTO.assignee) {
      AssigneeCache.cacheUser(new User(issueDTO.assignee))
    }
    if (issueDTO.children) {
      for (let child of issueDTO.children) {
        if (child.assignee) {
          AssigneeCache.cacheUser(new User(child.assignee))
        }
        children.push(this._createViewModel(child))
      }
    }
    issueDTO.children = children
    return this._createViewModel(issueDTO)
  }

  static _createViewModel (dto) {
    const container = Container.instance
    return new Issue(dto,
      container.get(DialogService),
      container.get(IssueService),
      container.get(EventAggregator))
  }
}
