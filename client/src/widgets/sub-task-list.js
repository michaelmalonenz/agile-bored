import {bindable,customElement,inject} from 'aurelia-framework'
import {IssueService} from '../services/issues'
import {IssueTypeService} from '../services/issue-types'
import {IssueViewModelFactory} from '../factories/issue-viewmodel-factory'
import { IssueTypeViewmodel } from '../widgets/issue-type'

@bindable('issues')
@bindable('issueId')
@customElement('sub-task-list')
@inject(IssueService, IssueTypeService, Element)
export class SubTaskList {
    constructor (issueService, issueTypeService, element) {
      this.issueService = issueService
      this.issueTypeService = issueTypeService
      this.element = element
      this.diplay = null
      this.newSubTitle = ''
      this.newIssueType = {}
      this.issueTypes = []
    }

    async bind () {
      const rawTypes = await this.issueTypeService.getIssueTypes()
      this.issueTypes = rawTypes
        .filter(t => t.subtask)
        .map(t => new IssueTypeViewmodel(t, true))
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
      this.element.querySelector('.sub-task-display-section').scrollTop = 0
    }

    createSubTask () {
      console.log('Creating sub task for... ', this.issueId, this.newSubTitle)
      this.newSubTitle = ''
      this.newIssueType = {}
    }
}
