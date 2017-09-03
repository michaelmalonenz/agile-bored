import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { IssueService } from './services/issues'
import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'

@inject(IssueService, IssueViewModelFactory, EventAggregator)
export class Board {

  constructor(issueService, issueViewModelFactory, eventAggregator) {
    this.issueService = issueService
    this.issueViewModelFactory = issueViewModelFactory
    this.eventAggregator = eventAggregator

    this.issues = []
  }

  activate () {
    return this.issueService.findAll().then(issues => {
      for(let issue of issues) {
        this.issues.push(this.issueViewModelFactory.create(issue))
      }
    })
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
}
