import {ISSUE_DELETED} from '../events'
import {IssueEditorDialog} from '../dialogs/issue-editor'
import {computedFrom} from 'aurelia-framework'

export class Issue {
  constructor (i, dialogService, issueService, eventAggregator) {
    this.issue = i
    this.dialogService = dialogService
    this.issueService = issueService
    this.eventAggregator = eventAggregator
  }

  get issueId () {
    return this.issue.id
  }

  @computedFrom('issue.issueType.colour')
  get typeStyle () {
    if (this.issue && this.issue.issueType) {
      return `border-color: ${this.issue.issueType.colour};`
    } else {
      return ''
    }
  }

  get hasChildren () {
    return this.issue.children && this.issue.children.length > 0
  }

  @computedFrom('issue.epic.name')
  get epicName () {
    if (this.issue && this.issue.epic && this.issue.epic.name) {
      return this.issue.epic.name
    }
    return ''
  }

  @computedFrom('issue.epic.colour')
  get epicStyle () {
    if (this.issue && this.issue.epic && this.issue.epic.colour) {
      return `background-color: ${this.issue.epic.colour};`
    }
    return ''
  }

  @computedFrom('issue.IssueStatus.name')
  get statusName () {
    if (this.issue && this.issue.IssueStatus && this.issue.IssueStatus.name) {
      return this.issue.IssueStatus.name
    }
    return ''
  }

  get children () {
    if (this.issue) {
      return this.issue.children
    }
    return []
  }

  editIssue () {
    this.dialogService.open({ viewModel: IssueEditorDialog,
      lock: true,
      keyboard: ['Escape'],
      model: {
        issue: this.issue,
        edit: true
      }
    }).whenClosed(async response => {
      if (!response.wasCancelled) {
        this.issue = await this.issueService.update(response.output)
      }
    })
  }

  async deleteIssue () {
    await this.issueService.delete(this.issue)
    this.eventAggregator.publish(ISSUE_DELETED, this.issue)
  }

  async updateStatus (status) {
    await this.issueService.updateStatus(this.issueId, status.id)
    this.issue = await this.issueService.get(this.issueId)
  }
}
