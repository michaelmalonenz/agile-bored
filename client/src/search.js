import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator'
import { PLATFORM } from 'aurelia-pal'

import { IssueService } from './services/issues'
import { SEARCH } from './events'
import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'

@inject(IssueService, IssueViewModelFactory, Router, EventAggregator, Element)
export class Search {

  constructor (issueService, issueViewModelFactory, router, eventAggregator, element) {
    this.issueService = issueService
    this.issueViewModelFactory = issueViewModelFactory
    this.router = router
    this.eventAggregator = eventAggregator
    this.element = element
    this.results = []
    this.doSearch = this._doSearch.bind(this)
    this.searching = false
    this.noResults = false
  }

  bind () {
    this.searchSubscription = this.eventAggregator.subscribe(SEARCH, this.doSearch)
  }

  unbind () {
    this.searchSubscription.dispose()
  }

  attached () {
    this.searchInput = this.element.querySelector('#search-term')
  }

  async activate (params, other) {
    this.searchTerm = params.search || ''
    if (this.searchTerm) {
      this.eventAggregator.publish(SEARCH)
    }
  }

  searchKeyPress (event) {
    if (event.which === 13) {
      this.triggerSearch()
    }
    else {
      return true
    }
  }

  searchButtonPress () {
    this.triggerSearch()
  }

  triggerSearch () {
    this.eventAggregator.publish(SEARCH)
    // The || null ensures that the query param is excluded from the URL
    this.router.navigateToRoute(PLATFORM.moduleName('search'), { search: this.searchTerm || null })
  }

  async _doSearch() {
    if (this.searchTerm) {
      this.searching = true
      const issues = await this.issueService.search(this.searchTerm)
      this.results = []
      if (issues) {
        for(let issue of issues) {
          this.results.push(this.issueViewModelFactory.create(issue))
        }
      }
      this.noResults = this.results.length === 0
      this.searching = false
    }
  }
}
