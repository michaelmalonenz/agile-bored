const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}
export class DateValueConverter {
  toView (value) {
    if (value) {
      return new Intl.DateTimeFormat(navigator.language, options).format(value)
    }
    return value
  }

  fromView (value) {
    return value
  }
}
