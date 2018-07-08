import {ISSUE_DELETED} from '../events'
import {IssueEditorDialog} from '../dialogs/issue-editor'

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

  get typeStyle () {
    if (this.issue && this.issue.issueType) {
      return `border-color: ${this.issue.issueType.colour};`
    } else {
      return ''
    }
  }

  get avatarUrl () {
    if (this.issue && this.issue.assignee && this.issue.assignee.avatarUrls) {
      return this.issue.assignee.avatarUrls['24x24']
    } else {
      return ''
    }
  }

  get displayName () {
    if (this.issue && this.issue.assignee && this.issue.assignee.displayName) {
      return this.issue.assignee.displayName
    } else {
      return ''
    }
  }

  get hasChildren () {
    return this.issue.children && this.issue.children.length > 0
  }

  get epicName () {
    if (this.issue && this.issue.epic && this.issue.epic.name) {
      return this.issue.epic.name
    }
    return ''
  }

  get epicStyle () {
    if (this.issue && this.issue.epic && this.issue.epic.colour) {
      return `background-color: ${this.issue.epic.colour}; color: white;`
    }
    return ''
  }

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
