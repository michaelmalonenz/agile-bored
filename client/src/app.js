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
      { route: ['', 'board'], name: 'board', moduleId: 'board', nav: true, title: 'Board', auth: true },
      { route: 'search', name: 'search', moduleId: 'search', nav: true, title: 'Search', auth: true },
      { route: 'login', name: 'login', moduleId: 'security/login', nav: false, title: 'Login' }
    ])

    this.router = router
  }
}
