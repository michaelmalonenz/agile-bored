import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { IssueService } from './services/issues'
import { StatusService } from './services/statuses'
import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'

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
    })
    const statusesPromise = this.statusService.findAllForProject().then(statuses => {
      this.statuses = statuses
    })

    return Promise.all([ issuesPromise, statusesPromise ])
  }

  bind () {
    this.issueCreatedSubscription = this.eventAggregator.subscribe('issue-created', (issue) => {
      this.issues.push(this.issueViewModelFactory.create(issue))
      this.issues.sort((a,b) => {
        return a.createdAt - b.createdAt
      })
    })
  }

  unbind () {
    this.issueCreatedSubscription.dispose()
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
}
