export class TokenConverter {
  constructor (symbolList) {
    this.symbolList = symbolList
  }

  convert (value) {
    if (!value) {
      return value
    }
    let result = ''
    for (let i = 0; i < value.length;) {
      for (let s = 0; s < this.symbolList.length; s++) {
        const sym = this.symbolList[s]
        if (value.substring(i, i + sym.startToken.length) === sym.startToken) {
          let foundClosingTag = false
          for (let j = i + sym.startToken.length; (j < value.length && !foundClosingTag);) {
            if (value.substring(j, j + sym.endToken.length) === sym.endToken) {
              foundClosingTag = true
              result += sym.startHtml
              const innerValue = value.substring(i + sym.startToken.length, j)
              if (sym.preFormatting) {
                result += innerValue.trim()
              } else {
                result += this.convert(innerValue)
              }
              result += sym.endHtml
              i = j + sym.endToken.length
            } else {
              j++
            }
          }
        }
      }
      result += value.substring(i, i + 1)
      i++
    }
    return result
  }
}
