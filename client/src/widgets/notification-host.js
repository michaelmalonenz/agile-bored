import { inject, customElement, computedFrom } from 'aurelia-framework'
import { CssAnimator } from 'aurelia-animator-css'
import { EventAggregator } from 'aurelia-event-aggregator'
import { ISSUE_CREATED } from '../events'


@inject(EventAggregator, CssAnimator, Element)
@customElement('notification-host')
export class NotificationHost {
  constructor (eventAggregator, animator, element) {
    this.eventAggregator = eventAggregator
    this.animator = animator
    this.element = element
    this.issue = null
  }
  
  bind () {
    this.issueCreatedSub =
    this.eventAggregator.subscribe(ISSUE_CREATED, this.handleIssueCreated.bind(this))
  }

  unbind () {
    this.issueCreatedSub.dispose()
  }

  @computedFrom('issue')
  get issueKey () {
    if (this.issue) {
      return this.issue.issue.key
    }
    return ''
  }

  handleIssueCreated (issue) {
    this.issue = issue
    const container = this.element.querySelector('.issue-create-notification-container')
    this.animator.animate(container, 'background-animation')
  }

  async viewClick () {
    await this.issue.editIssue()
    this.issue = null
  }

  close (event) {
    event.stopPropagation()
    this.issue = null
  }
}
