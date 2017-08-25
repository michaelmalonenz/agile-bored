import { inject } from 'aurelia-framework'
import { IssueService } from './services/issues'
import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'

@inject(IssueService, IssueViewModelFactory)
export class Board {

  constructor(issueService, issueViewModelFactory) {
    this.issueService = issueService
    this.issueViewModelFactory = issueViewModelFactory

    this.issues = []
  }

  activate () {
    return this.issueService.findAll().then(issues => {
      for(let issue of issues) {
        this.issues.push(this.issueViewModelFactory.create(issue))
      }
    })
  }
}
