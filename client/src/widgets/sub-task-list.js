import { bindable, customElement, inject, computedFrom } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { IssueService } from '../services/issues'
import { IssueTypeService } from '../services/issue-types'
import { IssueViewModelFactory } from '../factories/issue-viewmodel-factory'
import { IssueTypeViewmodel } from '../widgets/issue-type'
import { isEmpty } from '../utils/functions'
import { REFRESH_BOARD } from '../events'

@bindable('issues')
@bindable('issueId')
@customElement('sub-task-list')
@inject(IssueService, IssueTypeService, EventAggregator, Element)
export class SubTaskList {
    constructor (issueService, issueTypeService, eventAggregator, element) {
      this.issueService = issueService
      this.issueTypeService = issueTypeService
      this.eventAggregator = eventAggregator
      this.element = element
      this.diplay = null
      this.newSubTitle = ''
      this.newIssueType = {}
      this.issueTypes = []
      this.requiresRefresh = false
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

    detached () {
      if (this.requiresRefresh) {
        this.eventAggregator.publish(REFRESH_BOARD)
      }
    }

    displayTask (issue) {
      this.display = issue
      this.element.querySelector('.sub-task-display-section').scrollTop = 0
    }

    @computedFrom('newSubTitle', 'newIssueType')
    get disableCreate () {
      return this.newSubTitle === '' || isEmpty(this.newIssueType)
    }

    createSubTask () {
      const subTask = {
        title: this.newSubTitle,
        description: '',
        issueType: this.newIssueType,
        parentId: this.issueId
      }
      return this.issueService.create(subTask).then(issue => {
        this.newSubTitle = ''
        this.newIssueType = {}
        this.issues.push(IssueViewModelFactory.create(issue))
      })
    }

    async updateDisplayStatus(status) {
      if (this.display.IssueStatus.id !== status.id) {
        await this.issueService.updateStatus(this.display.id, status.id)
        this.display.IssueStatus = status
        this.requiresRefresh = true
      }
    }
}
