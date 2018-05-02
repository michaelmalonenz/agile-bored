export class Epic {
  constructor (obj) {
    this.id = ''
    this.key = ''
    this.name = ''
    this.summary = ''
    this.colour = ''
    Object.assign(this, obj)
  }
}
