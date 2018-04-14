import { inject, computedFrom } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

import { IssueService } from './services/issues'
import { StatusService } from './services/statuses'

import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'
import { ISSUE_CREATED, ISSUE_DELETED, REFRESH_BOARD } from './events'
import { AssigneeCache } from './utils/assignees-cache';

@inject(StatusService, IssueService, IssueViewModelFactory, EventAggregator)
export class Board {

  constructor(statusService, issueService, issueViewModelFactory, eventAggregator) {
    this.statusService = statusService
    this.issueService = issueService
    this.issueViewModelFactory = issueViewModelFactory
    this.eventAggregator = eventAggregator

    this.issues = []
  }

  async activate () {
    await this._refreshBoard()
  }

  bind () {
    this.issueCreatedSubscription =
      this.eventAggregator.subscribe(ISSUE_CREATED, this._issueCreated.bind(this))

    this.issueDeletedSubscription =
      this.eventAggregator.subscribe(ISSUE_DELETED, this._issueDeleted.bind(this))

    this.refreshBoardSubscription =
      this.eventAggregator.subscribe(REFRESH_BOARD, this._refreshBoard.bind(this))
  }

  unbind () {
    this.issueCreatedSubscription.dispose()
    this.issueDeletedSubscription.dispose()
    this.refreshBoardSubscription.dispose()
  }

  @computedFrom('issues')
  get otherIssues () {
    return this.issues.filter(i => !i.hasChildren)
  }

  @computedFrom('issues')
  get parentIssues () {
    return this.issues.filter(i => i.hasChildren)
  }

  @computedFrom('issues')
  get haveParentIssues () {
    return this.parentIssues.length > 0
  }

  canMove (item, source, handle, sibling) {
    return !item.classList.contains('status-name')
  }

  dropIssue (item, target, source, sibling, itemVM, siblingVM) {
    const targetVM = this._getViewModel(target)
    if (target !== source && targetVM) {
      targetVM.dropInto(itemVM, siblingVM)
    }
  }

  _getViewModel (element) {
    if (element && element.au && element.au.controller) {
      if (element.au.controller.viewModel.currentViewModel)
        return element.au.controller.viewModel.currentViewModel;
      else
        return element.au.controller.viewModel;
    }
    return null;
  }

  _issueCreated (issue) {
    this.issues.push(this.issueViewModelFactory.create(issue))
    this.issues.sort((a,b) => {
      return a.createdAt - b.createdAt
    })
  }

  _issueDeleted (issue) {
    const issueIndex = this.issues.findIndex(i => i.issueId === issue.id)
    this.issues.splice(issueIndex, 1)
  }

  _refreshBoard () {
    const issuesPromise = this.issueService.findAll().then(issues => {
      this.issues = []
      AssigneeCache.clearCache()
      for(let issue of issues) {
        this.issues.push(this.issueViewModelFactory.create(issue))
      }
    }).catch(err => console.error(err))

    const statusesPromise = this.statusService.findAllForProject().then(statuses => {
      this.statuses = statuses
    }).catch(err => console.error(err))

    return Promise.all([ issuesPromise, statusesPromise ])
  }
}
