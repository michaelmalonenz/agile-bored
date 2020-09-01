export class Settings {
  constructor (settings) {
    this.jiraUrl = ''
    this.jiraProjectName = ''
    this.jiraRapidBoardId = 0
    this.userId = 0
    this.useJira = false
    this.groupByEpic = false
    this.jiraEpicField = ''
    this.perfStatsIssueTypes = ''
    Object.assign(this, settings)
  }
}
