export class Settings {
  constructor (settings) {
    this.jiraUrl = ''
    this.useJira = false
    Object.assign(this, settings)
  }
}
