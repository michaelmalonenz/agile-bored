import {AuthorizeStep} from './authorise'

export class App {
  configureRouter (config, router) {
    config.title = 'Agile Board'
    config.addPipelineStep('authorize', AuthorizeStep)
    config.map([
      { route: ['', 'board'], name: 'board', moduleId: 'board', nav: true, title: 'Board', auth: true },
      { route: 'login', name: 'login', moduleId: 'login', nav: true, title: 'Login' }
    ])

    this.router = router
  }
}
