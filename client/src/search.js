import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator'

import { IssueService } from './services/issues'
import { SEARCH } from './events'

@inject(IssueService, Router, EventAggregator, Element)
export class Search {

  constructor (issueService, router, eventAggregator, element) {
    this.issueService = issueService
    this.router = router
    this.eventAggregator = eventAggregator
    this.element = element
    this.results = []
    this.doSearch = this._doSearch.bind(this)
  }

  bind () {
    this.searchSubscription = this.eventAggregator.subscribe(SEARCH, this.doSearch)
  }

  unbind () {
    this.searchSubscription.dispose()
  }

  attached () {
    this.searchInput = this.element.querySelector('#search-term')
    this.searchInput.onkeypress = this.searchKeyPress.bind(this)
  }

  detached() {
    this.searchInput.onkeypress = null
  }

  async activate (params, other) {
    this.searchTerm = params.search || ''
    if (this.searchTerm) {
      this.eventAggregator.publish('search')
    }
  }

  searchKeyPress (event) {
    if (event.which === 13) {
      this.triggerSearch()
    }
  }

  searchButtonPress () {
    this.triggerSearch()
  }

  triggerSearch () {
    this.eventAggregator.publish('search')
    // The || null ensures that the query param is excluded from the URL
    this.router.navigateToRoute('search', { search: this.searchTerm || null })
  }

  async _doSearch() {
    if (this.searchTerm) {
      this.results = await this.issueService.search(this.searchTerm)
    }
  }
}
