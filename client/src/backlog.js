import {inject} from 'aurelia-framework'
import {IssueService} from './services/issues'
import {IssueViewModelFactory} from './factories/issue-viewmodel-factory'

@inject(IssueService, IssueViewModelFactory)
export class Backlog {
  constructor (issueService, issueFactory) {
    this.issueService = issueService
    this.issueFactory = issueFactory
    this.issues = []
  }

  async activate () {
    const result = await this.issueService.getBacklogIssues()
    this.issues = []
    for (let issue of result) {
      this.issues.push(this.issueFactory.create(issue))
    }
  }
}
