export class Settings {
  constructor (settings) {
    this.jiraUrl = ''
    this.jiraProjectName = ''
    this.useJira = false
    Object.assign(this, settings)
  }
}
