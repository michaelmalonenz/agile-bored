import { inject } from 'aurelia-framework'
import { IssueService } from './services/issues'

@inject(IssueService)
export class Board {

  constructor(issueService) {
    this.issueService = issueService
  }
}
