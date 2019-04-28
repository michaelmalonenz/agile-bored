import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { PLATFORM } from 'aurelia-pal'
import Chart from 'chart.js'
import moment from 'moment'

import { ReportsService } from '../services/reports'
import { EpicService } from '../services/epics'

@inject(Element, ReportsService, EpicService, Router)
export class BurnUpReport {
  constructor (element, reportsService, epicService, router) {
    this.element = element
    this.reportsService = reportsService
    this.epicService = epicService
    this.router = router

    this.fromDate = null
    this.toDate = null

    this.loadingData = false
    this.epic = null
    this.completionDate = ''
  }

  async attached () {
    if (this.epic) {
      await this.updateGraph()
    }
  }

  detached () {
    if (this.chart) {
      this.chart.destroy()
    }
  }

  async activate (params) {
    if (params.from) {
      this.fromDate = new moment(params.from, 'YYYY-MM-DD')
    }
    if (params.to) {
      this.toDate = new moment(params.to, 'YYYY-MM-DD')
    }
    if (params.epic) {
      this.epic = await this.epicService.get(params.epic)
    }
  }

  updateUrl () {
    this.router.navigateToRoute('burnup', {
      epic: this.epic ? this.epic.id : null,
      from: this.fromDate ? this.fromDate.format('YYYY-MM-DD') : null,
      to: this.toDate ? this.toDate.format('YYYY-MM-DD') : null
    })
  }

  async updateGraphClick () {
    this.updateUrl()
    await this.updateGraph()
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
    const estimate = {
      label: 'Estimate',
      data: [],
      borderDash: [5, 10],
      type: 'line',
      spanGaps: false
    }
    for (let day of Object.keys(data)) {
      const date = new moment(day, 'YYYY-MM-DD')
      toDo.data.push({x: date, y: data[day].toDo})
      inProgress.data.push({x: date, y: data[day].inProgress})
      resolved.data.push({x: date, y: data[day].resolved})
      estimate.data.push({x: date, y: undefined})
    }
    const estimateStart = result.estimate.start
    const estimateEnd = result.estimate.end
    estimate.data.push({
      x: new moment(estimateStart.date, 'YYYY-MM-DD'),
      y: estimateStart.value
    },{
      x: new moment(estimateEnd.date, 'YYYY-MM-DD'),
      y: estimateEnd.value
    })
    toDo.data.push({x: new moment(estimateEnd.date, 'YYYY-MM-DD'), y: undefined})
    inProgress.data.push({x: new moment(estimateEnd.date, 'YYYY-MM-DD'), y: undefined})
    resolved.data.push({x: new moment(estimateEnd.date, 'YYYY-MM-DD'), y: undefined})

    this.loadingData = false
    if (this.chart) {
      this.chart.destroy()
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
        elements: {
          point: {
            radius: 1,
          }
        },
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
    return await this.epicService.searchEpics(value)
  }
}
