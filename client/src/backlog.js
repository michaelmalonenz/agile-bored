import {inject} from 'aurelia-framework'
import {IssueService} from './services/issues'
import {IssueViewModelFactory} from './factories/issue-viewmodel-factory'

@inject(IssueService)
export class Backlog {
  constructor (issueService) {
    this.issueService = issueService
    this.issues = []
  }

  async activate () {
    const result = await this.issueService.getBacklogIssues()
    this.issues = []
    for (let issue of result) {
      this.issues.push(IssueViewModelFactory.create(issue))
    }
  }
}
