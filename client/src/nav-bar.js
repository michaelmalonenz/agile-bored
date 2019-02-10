import { inject, bindable, customElement } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'

import { SecuritySettings } from './security/security-settings'
import { REFRESH_BOARD, REFRESH_BOARD_COMPLETE } from './events'

@customElement('nav-bar')
@bindable('router')
@inject(DialogService, EventAggregator)
export class NavBar {

  constructor (dialogService, eventAggregator) {
    this.dialogService = dialogService
    this.eventAggregator = eventAggregator
    this.securitySettings = SecuritySettings.instance()
  }

  bind () {
    this.refreshBeginSub = this.eventAggregator
      .subscribe(REFRESH_BOARD, this._refreshBegin.bind(this))
    this.refreshCompleteSub = this.eventAggregator
      .subscribe(REFRESH_BOARD_COMPLETE, this._refreshComplete.bind(this))
  }

  unbind () {
    this.refreshCompleteSub.dispose()
    this.refreshBeginSub.dispose()
  }

  get loggedIn () {
    return this.securitySettings.loggedIn
  }

  get isLoading () {
    return this.router.isNavigating || this.refreshing
  }

  _refreshBegin () {
    this.refreshing = true
  }

  _refreshComplete () {
    this.refreshing = false
  }
}
