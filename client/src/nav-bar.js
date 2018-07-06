import { inject, bindable, customElement } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'

import { SettingsDialog } from 'dialogs/settings'
import { StandUpDialog } from 'dialogs/stand-up'
import { SecuritySettings } from './security/security-settings'
import { SettingsService } from './services/settings'
import { REFRESH_BOARD, REFRESH_BOARD_COMPLETE, LOG_OUT } from './events'

@customElement('nav-bar')
@bindable('router')
@inject(DialogService, SettingsService, EventAggregator)
export class NavBar {

  constructor (dialogService, settingsService, eventAggregator) {
    this.dialogService = dialogService
    this.settingsService = settingsService
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

  async showSettings () {
    let settings = await this.settingsService.get()
    let usingJira = settings.useJira
    this.dialogService.open({
      viewModel: SettingsDialog,
      model: settings,
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        await this.settingsService.update(response.output)
        if (usingJira !== response.output.useJira) {
          this.eventAggregator.publish(LOG_OUT)
        }
      }
    })
  }

  refreshBoard () {
    this.eventAggregator.publish(REFRESH_BOARD)
  }

  _refreshBegin () {
    this.refreshing = true
  }

  _refreshComplete () {
    this.refreshing = false
  }

  async standUp () {
    await this.dialogService.open({
      viewModel: StandUpDialog,
      lock: false
    }).whenClosed(async () => {
      this.refreshBoard()
    })
  }
}
