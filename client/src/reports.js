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

    this.fromDate = null
    this.toDate = null

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
    this.loadingData = true
    const fromValue = this.fromDate ? this.fromDate.format('YYYY-MM-DD') : null
    const toValue = this.toDate ? this.toDate.add(1, 'day').format('YYYY-MM-DD') : null
    const result = await this.reportsService.epicRemaining(this.epic.id, fromValue, toValue)
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
      const date = new moment(day, 'YYYY-MM-DD')
      toDo.data.push({x: date, y: data[day].toDo})
      inProgress.data.push({x: date, y: data[day].inProgress})
      resolved.data.push({x: date, y: data[day].resolved})
      lastDay = date
      lastTotal = data[day].toDo + data[day].inProgress
    }

    this.loadingData = false
    if (this.chart) {
      this.chart.destroy()
    }
    
    const estimate = {
      label: 'Estimate',
      data: [{x: new moment(lastDay), y: lastTotal}, {x: this.completionDate, y: 0}],
      borderDash: [5, 10],
      type: 'line'
    }

    const context = this.element.querySelector('#chart').getContext('2d')
    this.chart = new Chart(context, {
      type: 'line',
      data: {
        datasets: [
          toDo,
          inProgress,
          resolved,
          estimate
        ]
      },
      options: {
        animation: {
          duration: 0
        },
        layout: {
          padding: 20
        },
        scales: {
          yAxes: [{
            stacked: true
          }],
          xAxes: [{
            type: 'time',
          }]
        }
      }
    })
  }

  async epicSearch (value) {
    return await this.issueService.searchEpics(value)
  }
}
