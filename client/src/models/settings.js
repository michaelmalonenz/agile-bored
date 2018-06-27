export class Settings {
  constructor (settings) {
    this.jiraUrl = ''
    this.jiraProjectName = ''
    this.jiraRapidBoardId = 0
    this.useJira = false
    this.groupByEpic = false
    this.jiraEpicField = ''
    Object.assign(this, settings)
  }
}
