import { inject, customElement } from 'aurelia-framework'
import { CssAnimator } from 'aurelia-animator-css'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'

import { REFRESH_BOARD, LOG_OUT } from '../events'
import { StandUpDialog } from '../dialogs/stand-up'
import { SettingsDialog } from '../dialogs/settings'
import { SettingsService } from '../services/settings'

@inject(CssAnimator, Element, EventAggregator, DialogService, SettingsService)
@customElement('popup-menu')
export class PopupMenu {
  constructor (animator, element, eventAggregator, dialogService, settingsService) {
    this.animator = animator
    this.element = element
    this.eventAggregator = eventAggregator
    this.dialogService = dialogService
    this.settingsService = settingsService

    this.menuVisible = false
    this.itemsVisible = false
  }

  toggleMenu () {
    if (this.menuVisible) {
      this.hideMenu()
    } else {
      this.showMenu()
    }
  }

  showMenu () {
    const containerElem = this.element.querySelector('.popup-menu-container')
    this.itemsVisible = true
    return this.animator.animate(containerElem, 'popup-menu').then(() => {
      this.menuVisible = true
    })
  }

  hideMenu () {
    const containerElem = this.element.querySelector('.popup-menu-container')
    return this.animator.animate(containerElem, 'popdown-menu').then(() => {
      this.menuVisible = false
      this.itemsVisible = false
    })
  }

  refreshBoard () {
    this.eventAggregator.publish(REFRESH_BOARD)
  }

  async standUp () {
    await this.dialogService.open({
      viewModel: StandUpDialog,
      lock: false
    }).whenClosed(async () => {
      this.refreshBoard()
    })
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
