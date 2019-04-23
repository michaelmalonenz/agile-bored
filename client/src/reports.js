export class Reports {
  configureRouter (config, router) {
    this.router = router
    config.map([
      { route: '', redirect: 'burnup' },
      { route: 'burnup', name: 'burnup', moduleId: 'reports/burnup', nav: true, title: 'Burn Up', auth: true, settings: { icon: 'fa-fire-alt' } },
      { route: 'org-stats', name: 'org-stats', moduleId: 'reports/org-stats', nav: true, title: 'Organization Statistics', auth: true, settings: { icon: 'fa-ruler' } }
    ])
  }
}
