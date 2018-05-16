import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

import { IssueService } from 'services/issues'
import { IssueViewModelFactory } from 'factories/issue-viewmodel-factory'

@inject(DialogController, Element, IssueService, IssueViewModelFactory)
export class StandUpDialog {

  constructor (controller, elem, issueService, issueViewModelFactory) {
    this.controller = controller
    this.element = elem
    this.issueService = issueService
    this.issueViewModelFactory = issueViewModelFactory
    this.inFullScreen = false
    this.issues = []
    this.loading = true
    this.displayedIssue = false
    this.displayingComments = false
  }

  get contentHeight () {
    return this.inFullScreen ? '89vh' : '60vh'
  }

  get displayingIssue () {
    return !!this.displayedIssue && !this.displayingComments
  }

  get displayedIssueId () {
    if (this.displayedIssue) {
      return this.displayedIssue.issueId
    }
    return null
  }

  showView () {
    this.displayingComments = false
  }

  showComments () {
    this.displayingComments = true
  }

  async bind () {
    const resIssues = await this.issueService.getStandUpIssues()
    this.issues = []
    for(let issue of resIssues) {
      this.issues.push(this.issueViewModelFactory.create(issue))
    }
    this.loading = false
  }

  fullScreen () {
    const dialog = this.element.querySelector('.stand-up-dialog')
    const enterFn = dialog.requestFullscreen || dialog.webkitRequestFullscreen || dialog.mozRequestFullScreen
    if (enterFn) {
      this.inFullScreen = true
      enterFn.call(dialog)
    }
  }

  exitFullScreen () {
    const exitFn = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen
    if (exitFn) {
      exitFn.call(document)
      this.inFullScreen = false
    }
  }

  display (issue) {
    this.displayedIssue = issue
    this.showView()
  }
}
