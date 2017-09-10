import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { IssueService } from './services/issues'
import { StatusService } from './services/statuses'
import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'
import { ISSUE_CREATED, ISSUE_DELETED } from './events'

@inject(IssueService, IssueViewModelFactory, StatusService, EventAggregator)
export class Board {

  constructor(issueService, issueViewModelFactory, statusService, eventAggregator) {
    this.issueService = issueService
    this.issueViewModelFactory = issueViewModelFactory
    this.statusService = statusService
    this.eventAggregator = eventAggregator

    this.issues = []
  }

  activate () {
    const issuesPromise = this.issueService.findAll().then(issues => {
      for(let issue of issues) {
        this.issues.push(this.issueViewModelFactory.create(issue))
      }
    }).catch(err => console.error(err))

    const statusesPromise = this.statusService.findAllForProject().then(statuses => {
      this.statuses = statuses
    }).catch(err => console.error(err))

    return Promise.all([ issuesPromise, statusesPromise ])
  }

  bind () {
    this.issueCreatedSubscription =
      this.eventAggregator.subscribe(ISSUE_CREATED, this._issueCreated.bind())

    this.issueDeletedSubscription =
      this.eventAggregator.subscribe(ISSUE_DELETED, this._issueDeleted.bind())
  }

  unbind () {
    this.issueCreatedSubscription.dispose()
    this.issueDeletedSubscription.dispose()
  }

  canMove (item, source, handle, sibling) {
    return !item.classList.contains('status-name')
  }

  dropIssue (item, target, source, sibling, itemVM, siblingVM) {
    const targetVM = this._getViewModel(target)
    if (targetVM) {
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
}
