export class Reports {
  configureRouter (config, router) {
    this.router = router
    config.map([
      { route: '', redirect: 'burnup' },
      { route: 'burnup', name: 'burnup', moduleId: 'reports/burnup', nav: true, title: 'Burn Up', auth: true, settings: { icon: 'fa-fire-alt' } },
      { route: 'perf-stats', name: 'perf-stats', moduleId: 'reports/perf-stats', nav: true, title: 'Perf Stats', auth: true, settings: { icon: 'fa-ruler' } }
    ])
  }
}
