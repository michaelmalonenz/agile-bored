import {bindable,customElement,inject} from 'aurelia-framework'
import {IssueService} from '../services/issues'
import {IssueViewModelFactory} from '../factories/issue-viewmodel-factory'

@bindable('issues')
@bindable('issueId')
@customElement('sub-task-list')
@inject(IssueService)
export class SubTaskList {
    constructor (issueService) {
      this.issueService = issueService
      this.diplay = null
    }

    async bind () {
      if (this.issueId) {
        const tasks = await this.issueService.getSubtasks(this.issueId)
        this.issues = []
        for (let issue of tasks) {
          this.issues.push(IssueViewModelFactory.create(issue))
        }
      }
    }

    displayTask (issue) {
      this.display = issue
    }
}
