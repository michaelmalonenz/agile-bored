export class App {
  configureRouter (config, router) {
    config.title = 'Aurelia'
    config.map([
      { route: ['', 'board'], name: 'board', moduleId: 'board', nav: true, title: 'Board' }
    ])

    this.router = router
  }
}
