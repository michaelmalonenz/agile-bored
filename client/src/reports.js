export class Reports {
  configureRouter (config, router) {
    this.router = router
    config.map([
      { route: '', redirect: 'burnup' },
      { route: 'burnup', name: 'burnup', moduleId: 'reports/burnup', nav: true, title: 'Burn Up', auth: true, settings: { icon: 'fa-th-list' } },
      { route: 'westrum', name: 'westrum', moduleId: 'reports/westrum', nav: true, title: 'Westrum', auth: true, settings: { icon: 'fa-search' } }
    ])
  }
}
