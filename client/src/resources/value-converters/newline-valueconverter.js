export class NewlineValueConverter {
  toView (value) {
    if (value) {
      return this._replaceAll(value, '\n', '<br>')
    }
    return value
  }

  fromView (value) {
    if (value) {
      return this._replaceAll(value, '<br>', '\n')
    }
    return value
  }

  _replaceAll (string, find, replace) {
    let regexp
    if (find instanceof RegExp) {
      if (find.global) {
        regexp = find
      } else {
        regexp = new RegExp(find.source, `${find.flags}g`)
      }
    } else {
      regexp = new RegExp(find, 'g')
    }

    return string.replace(regexp, replace)
  }
}
