import { inject, computedFrom } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { TaskQueue } from 'aurelia-task-queue'

import { IssueService } from './services/issues'
import { StatusService } from './services/statuses'
import { SettingsService } from './services/settings'

import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'
import { ISSUE_CREATED, ISSUE_DELETED, REFRESH_BOARD, REFRESH_BOARD_COMPLETE } from './events'
import { AssigneeCache } from './utils/assignees-cache';

@inject(StatusService, IssueService, SettingsService, EventAggregator, TaskQueue)
export class Board {

  constructor(statusService, issueService, settingsService, eventAggregator, queue) {
    this.statusService = statusService
    this.issueService = issueService
    this.settingsService = settingsService
    this.eventAggregator = eventAggregator
    this.queue = queue

    this.settings = {}
    this.epics = []
    this.issues = []
  }

  async activate (params) {
    await this._refreshBoard()
    if (params.issue) {
      const issueToEdit = this.issues.find(issue => issue.issue.key === params.issue)
      if (issueToEdit) {
        this.queue.queueTask(() => {
          issueToEdit.editIssue()
        })
      }
    }
  }

  bind () {
    this.issueCreatedSubscription =
      this.eventAggregator.subscribe(ISSUE_CREATED, this._issueCreated.bind(this))

    this.issueDeletedSubscription =
      this.eventAggregator.subscribe(ISSUE_DELETED, this._issueDeleted.bind(this))

    this.refreshBoardSubscription =
      this.eventAggregator.subscribe(REFRESH_BOARD, this._refreshBoard.bind(this))
  }

  unbind () {
    this.issueCreatedSubscription.dispose()
    this.issueDeletedSubscription.dispose()
    this.refreshBoardSubscription.dispose()
  }

  @computedFrom('issues')
  get otherIssues () {
    return this.issues.filter(i => !i.hasChildren)
  }

  @computedFrom('issues')
  get parentIssues () {
    return this.issues.filter(i => i.hasChildren)
  }

  @computedFrom('issues')
  get haveParentIssues () {
    return this.parentIssues.length > 0
  }

  @computedFrom('issues')
  get haveOtherIssues () {
    return this.otherIssues.length > 0
  }

  @computedFrom('settings')
  get groupByEpic () {
    return this.settings.groupByEpic
  }

  dropIssue (_item, target, source, _sibling, itemVM, siblingVM) {
    const targetVM = this._getViewModel(target)
    if (target !== source && targetVM) {
      targetVM.dropInto(itemVM, siblingVM)
    }
  }

  _getViewModel (element) {
    if (element && element.au && element.au.controller) {
      if (element.au.controller.viewModel.currentViewModel)
        return element.au.controller.viewModel.currentViewModel;
      else
        return element.au.controller.viewModel;
    }
    return null;
  }

  _issueCreated (issue) {
    const createdVm = IssueViewModelFactory.create(issue)
    // This works around the observer, forcing a re-render
    this.issues = this.issues.concat([createdVm])
  }

  _issueDeleted (issue) {
    const issueIndex = this.issues.findIndex(i => i.issueId === issue.id)
    this.issues.splice(issueIndex, 1)
  }

  _refreshBoard () {
    return this.settingsService.get().then(settings => {
      this.settings = settings
      let issuesPromise
      if (settings.groupByEpic) {
        issuesPromise = this.issueService.getIssuesByEpic()
        .then(epics => {
          this.epics = []
          AssigneeCache.clearCache()
          for(let epic of epics) {
              let issues = []
              for (let issue of epic.issues) {
                issues.push(IssueViewModelFactory.create(issue))
              }
              epic.issues = issues
              this.epics.push(epic)
            }
          }).catch(err => console.error(err))
      } else {
        issuesPromise = this.issueService.findAll().then(issues => {
          this.issues = []
          AssigneeCache.clearCache()
          for(let issue of issues) {
            this.issues.push(IssueViewModelFactory.create(issue))
          }
        }).catch(err => console.error(err))
      }

      const statusesPromise = this.statusService.findAllForProject(true)
        .then(statuses => {
          this.statuses = statuses
        }).catch(err => console.error(err))

      return Promise.all([ issuesPromise, statusesPromise ]).then(() => {
        this.eventAggregator.publish(REFRESH_BOARD_COMPLETE)
      })
    })
  }
}
