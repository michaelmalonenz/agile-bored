import { inject } from 'aurelia-framework'
import Chart from 'chart.js'
import moment from 'moment'

import { ReportsService } from './services/reports'

@inject(Element, ReportsService)
export class Reports {
  constructor (element, reportsService) {
    this.element = element
    this.reportsService = reportsService

    this.fromDate = new moment().subtract(1, 'month')
    this.toDate = new moment()

    this.data = {
      labels: ['Zero', 'Ten', 'Twenty', 'Thirty', 'Fourty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety', 'One Hundred'],
      datasets: [{
        label: 'ToDo',
        backgroundColor: 'rgb(66, 33, 99, 0.5)',
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        fill: 'origin'
      }, {
        label: 'In Progress',
        backgroundColor: 'rgb(0, 255, 0, 0.5)',
        data: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        fill: '-1'
      }]
    }
  }

  attached () {
    const context = this.element.querySelector('#chart').getContext('2d')
    this.chart = new Chart(context, {
      type: 'line',
      data: this.data,
      options: {
        scales: {
          yAxes: [{
            stacked: true
          }]
        }
      }
    })
  }

  detached () {
    this.chart.destroy()
  }

  async updateGraph () {
    const data = await this.reportsService.get(this.fromDate.format('YYYY-MM-DD'), this.toDate.format('YYYY-MM-DD'))
    console.log(data)
  }
}
