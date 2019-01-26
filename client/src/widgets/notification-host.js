import { inject, customElement } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { NOTIFICATION } from '../events'


@inject(EventAggregator)
@customElement('notification-host')
export class NotificationHost {
  constructor (eventAggregator) {
    this.eventAggregator = eventAggregator
  }

  bind () {
    this.notificationSub = this.eventAggregator.subscribe(NOTIFICATION, this.handleNotification.bind(this))
  }

  unbind () {
    this.notificationSub.dispose()
  }

  handleNotification (notification) {
    
  }
}
