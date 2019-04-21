import { inject } from 'aurelia-framework'
import { ReportsService } from '../services/reports'

@inject(ReportsService)
export class Westrum {
  constructor (reportsService) {
    this.reportsService = reportsService
    this.report = {
      averageLeadTime: 0,
      averageCycleTime: 0,
      totalIssuesCompleted: 0
    }
  }

  async activate () {
    this.report = await this.reportsService.westrum()
    console.log(this.report)
  }
}
