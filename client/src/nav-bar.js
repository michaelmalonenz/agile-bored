import { inject, bindable, customElement } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { SettingsDialog } from 'dialogs/settings'
import { EventAggregator } from 'aurelia-event-aggregator'

import {SecuritySettings} from './security/security-settings'
import { SettingsService } from './services/settings'
import { REFRESH_BOARD, LOG_OUT } from './events'

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

  get loggedIn () {
    return this.securitySettings.loggedIn
  }

  async showSettings () {
    let settings = await this.settingsService.get()
    let usingJira = settings.useJira
    this.dialogService.open({
      viewModel: SettingsDialog,
      model: settings,
      centerHorizontalOnly: true,
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
}
