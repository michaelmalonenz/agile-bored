import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator'
import { PLATFORM } from 'aurelia-pal'
import moment from 'moment'

import { IssueService } from './services/issues'
import { SEARCH } from './events'
import { IssueViewModelFactory } from './factories/issue-viewmodel-factory'

@inject(IssueService, Router, EventAggregator, Element)
export class Search {

  constructor (issueService, router, eventAggregator, element) {
    this.issueService = issueService
    this.router = router
    this.eventAggregator = eventAggregator
    this.element = element
    this.results = []
    this.doSearch = this._doSearch.bind(this)
    this.searching = false
    this.noResults = false

    this.fromDate = new moment().subtract(1, 'year')
    this.toDate = new moment()
    this.includeDone = false
  }

  async bind () {
    this.searchSubscription = this.eventAggregator.subscribe(SEARCH, this.doSearch)
    if (this.searchTerm) {
      await this._doSearch()
    }
  }

  unbind () {
    this.searchSubscription.dispose()
  }

  attached () {
    this.searchInput = this.element.querySelector('#search-term')
  }

  async activate (params) {
    this.searchTerm = params.search || ''
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
    this.router.navigateToRoute(PLATFORM.moduleName('search'), {
      // The || null ensures that the query param is excluded from the URL
      search: this.searchTerm || null,
      from: this.fromDate.format('YYYY-MM-DD'),
      to: this.toDate.format('YYYY-MM-DD'),
      done: this.includeDone
    })
  }

  async _doSearch() {
    if (this.searchTerm) {
      this.searching = true
      const issues = await this.issueService.search(
        this.searchTerm,
        this.fromDate.format('YYYY-MM-DD'),
        this.toDate.format('YYYY-MM-DD'),
        this.includeDone)
      this.results = []
      if (issues) {
        for(let issue of issues) {
          this.results.push(IssueViewModelFactory.create(issue))
        }
      }
      this.noResults = this.results.length === 0
      this.searching = false
    }
  }
}
