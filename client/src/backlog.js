import {inject} from 'aurelia-framework'
import {IssueService} from './services/issues'

@inject(IssueService)
export class Backlog {
  constructor (issueService) {
    this.issueService = issueService
    this.issues = []
  }

  async activate () {
    this.issues = await this.issueService.getBacklogIssues()
  }
}
