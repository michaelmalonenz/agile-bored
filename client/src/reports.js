import { inject } from 'aurelia-framework'
import Chart from 'chart.js'
import moment from 'moment'

import { ReportsService } from './services/reports'
import { IssueService } from './services/issues'

@inject(Element, ReportsService, IssueService)
export class Reports {
  constructor (element, reportsService, issueService) {
    this.element = element
    this.reportsService = reportsService
    this.issueService = issueService

    this.fromDate = new moment().subtract(1, 'month')
    this.toDate = new moment()

    this.loadingData = false
    this.epicKey = ''
    this.epic = null
    this.completionDate = ''
  }

  detached () {
    if (this.chart) {
      this.chart.destroy()
    }
  }

  async updateGraph () {
    // const data = await this.reportsService.get(this.fromDate.format('YYYY-MM-DD'), this.toDate.format('YYYY-MM-DD'))
    this.loadingData = true
    const result = await this.reportsService.epicRemaining(this.epic.id)
    const data = result.data
    this.completionDate = new moment(result.estimatedCompletion).format('YYYY-MM-DD')
    const toDo = {
      label: 'To Do',
      backgroundColor: 'rgb(0, 0, 200, 0.5)',
      fill: 'origin',
      data: []
    }
    const inProgress = {
      label: 'In Progress',
      backgroundColor: 'rgb(200, 0, 0, 0.5)',
      fill: '-1',
      data: []
    }
    const resolved = {
      label: 'Resolved',
      backgroundColor: 'rgb(0, 200, 0, 0.5)',
      fill: '-1',
      data: []
    }
    let lastDay, lastTotal
    for (let day of Object.keys(data)) {
      toDo.data.push(data[day].toDo)
      inProgress.data.push(data[day].inProgress)
      resolved.data.push(data[day].resolved)
      lastDay = day
      lastTotal = data[day].toDo + data[day].inProgress + data[day].resolved
    }

    this.loadingData = false
    if (this.chart) {
      this.chart.destroy()
    }
    
    const estimate = {
      label: 'Estimate',
      data: [{x: lastDay, y: lastTotal}, {x: this.completionDate, y: 0}],
      type: 'line'
    }

    const context = this.element.querySelector('#chart').getContext('2d')
    this.chart = new Chart(context, {
      type: 'line',
      data: {
        labels: Object.keys(data),
        datasets: [
          toDo,
          inProgress,
          resolved
        ]
      },
      options: {
        scales: {
          yAxes: [{
            stacked: true
          }]
        }
      }
    })
  }

  async epicSearch (value) {
    return await this.issueService.searchEpics(value)
  }
}
