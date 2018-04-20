export class Settings {
  constructor (settings) {
    this.jiraUrl = ''
    this.jiraProjectName = ''
    this.jiraRapidBoardId = 0
    this.useJira = false
    Object.assign(this, settings)
  }
}
