import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'

import {SecuritySettings} from './security/security-settings'
import {AuthorizeStep} from './security/authorise'
import {LOG_OUT} from './events'

@inject(EventAggregator)
export class App {
  constructor (eventAggregator) {
    this.eventAggregator = eventAggregator
  }

  bind () {
    this.logOutSub = this.eventAggregator.subscribe(LOG_OUT, () => {
      SecuritySettings.instance().initialise('', '')
      window.location = "/"
    })
  }

  unbind () {
    this.logOutSub.dispose()
  }

  configureRouter (config, router) {
    config.title = 'Agile Bored'
    config.addPipelineStep('authorize', AuthorizeStep)
    config.map([
      { route: ['', 'board'], name: 'board', moduleId: 'board', nav: true, title: 'Board', auth: true, settings: { icon: 'fa-th' } },
      { route: 'backlog', name: 'backlog', moduleId: 'backlog', nav: true, title: 'Backlog', auth: true, settings: { icon: 'fa-th-list' } },
      { route: 'search', name: 'search', moduleId: 'search', nav: true, title: 'Search', auth: true, settings: { icon: 'fa-search' } },
      { route: 'reports', name: 'reports', moduleId: 'reports', nav: true, title: 'Reports', auth: true, settings: { icon: 'fa-chart-bar' } },
      { route: 'login', name: 'login', moduleId: 'security/login', nav: false, title: 'Login' }
    ])

    this.router = router
  }
}
