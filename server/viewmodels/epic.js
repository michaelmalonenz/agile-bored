module.exports = class EpicViewModel {
  constructor () {
    this.id = 0
    this.key = ''
    this.name = ''
    this.summary = ''
    this.colour = ''
    this.issues = []
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new EpicViewModel()
      result.id = obj.id
      result.key = obj.key
      result.name = obj.name
      result.summary = obj.summary
      result.colour = translateEpicColour(obj.color.key)
    }
    return result
  }

  static createNullEpic (children) {
    let result = new EpicViewModel()
    result.name = 'No Epic'
    result.colour = 'none'
    result.issues = children
    return result
  }

  static createFromLocal (obj) {
    let result
    if (obj) {
      result = new EpicViewModel()
      result.id = obj.id
      result.key = `AB-${obj.id}`
      result.name = obj.title
      result.summary = obj.summary
      result.colour = 'rgba(0,102,255,0.6)'
    }
    return result
  }
}

const colours = {
  color_1: 'rgba(0,102,0,0.6)',
  color_2: 'rgba(0,102,255,0.6)',
  color_3: 'rgba(51,0,102,0.6)',
  color_4: 'rgba(102,0,255,0.6)',
  color_5: 'rgba(102,0,51,0.6)',
  color_6: 'rgba(153,51,255,0.6)',
  color_7: 'rgba(153,0,51,0.6)',
  color_8: 'rgba(0,51,153,0.6)',
  color_9: 'rgba(153,102,255,0.6)',
  color_10: 'rgba(204,0,255,0.6)',
  color_11: 'rgba(204,51,0,0.6)',
  color_12: 'rgba(255,102,0,0.6)',
  color_13: 'rgba(0,0,0,0.6)',
  color_14: 'rgba(0,51,204,0.6)',
  color_15: 'rgba(204,51,102,0.6)',
  color_16: 'rgba(255,51,153,0.6)'
}

function translateEpicColour (colorKey) {
  if (colours[colorKey]) {
    return colours[colorKey]
  }
  return 'rebeccapurple'
}
