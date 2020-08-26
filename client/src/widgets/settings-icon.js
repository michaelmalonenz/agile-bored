import { inject, customElement, bindable } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'

import { SettingsDialog } from '../dialogs/settings'
import { SettingsService } from '../services/settings'
import { LOG_OUT } from '../events'
import { Event } from 'jquery'

@inject(DialogService, SettingsService, EventAggregator)
@customElement('settings-icon')
export class SettingsIcon {
  constructor(dialogService, settingsService, eventAggregator) {
    this.dialogService = dialogService
    this.settingsService = settingsService
    this.eventAggregator = eventAggregator
  }

  async showSettings () {
    let settings = await this.settingsService.get()
    const usingJira = settings.useJira
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
}
