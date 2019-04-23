import { inject } from 'aurelia-framework'
import { ReportsService } from '../services/reports'

const ticksInAnHour = 60 * 60 * 1000
const ticksInADay = 24 * ticksInAnHour

@inject(ReportsService)
export class OrgStats {
  constructor (reportsService) {
    this.reportsService = reportsService
    this.report = {
      averageLeadTime: 0,
      averageCycleTime: 0,
      averageCommitToDeploy: 0,
      totalIssuesCompleted: 0
    }
  }

  async activate () {
    const times = await this.reportsService.orgStats()
    const goodTimes = times.filter(t => t.intoProgressTime !== null)
    this.times = goodTimes.map(t => { 
      return {
        leadTime: new Date(t.completedAt) - new Date(t.createdAt),
        leadTimeDays: Math.floor((new Date(t.completedAt) - new Date(t.createdAt)) / ticksInADay),
        cycleTime: new Date(t.completedAt) - new Date(t.intoProgressTime),
        cycleTimeDays: Math.floor((new Date(t.completedAt) - new Date(t.intoProgressTime)) / ticksInADay),
        commitToDeploy: t.commitTime ? new Date(t.completedAt) - new Date(t.commitTime) : 0,
        commitToDeployHours: t.commitTime ? ((new Date(t.completedAt) - new Date(t.commitTime)) / ticksInAnHour).toFixed(2) : 0,
        key: t.key,
        title: t.title,
        selected: true 
      }
    })
    this.updateReport() 
  }

  updateReport () {
    const averageLeadTime = Math.floor(this.times.reduce((prev, current) => {
      if (current.selected) {
        return prev + current.leadTime
      }
      return prev
    }, 0.0) / (this.times.length * ticksInADay))
    const averageCycleTime = Math.floor(this.times.reduce((prev, current) => {
      if (current.selected) {
        return prev + current.cycleTime
      }
      return prev
    }, 0.0) / (this.times.length * ticksInADay))
    const averageCommitToDeploy = this.times.reduce((prev, current) => {
      if (current.selected) {
        return prev + current.commitToDeploy
      }
      return prev
    }, 0.0) / (this.times.length * ticksInAnHour)
    this.report = {
      averageLeadTime: getTimeString(averageLeadTime),
      averageCycleTime: getTimeString(averageCycleTime),
      averageCommitToDeploy: getTimeString(averageCommitToDeploy),
      totalIssuesCompleted: this.times.length
    }
  }
}

function getTimeString (days) {
  let result = ''
  let weeks = 0
  let years = 0
  if (days > 7) {
    weeks = Math.floor(days / 7)
    days = days % 7
  }
  if (weeks > 52) {
    years = Math.floor(weeks / 52)
    weeks = weeks % 52
  }
  if (years > 0) {
    result += `${years} year${years === 1 ? '' : 's'} `
  }
  if (weeks > 0) {
    result += `${weeks} week${weeks === 1 ? '' : 's'} `
  }
  if (days > 0) {
    result += `${days} day${days === 1 ? '' : 's'}`
  }
  return result
}
