export class TokenConverter {
  constructor (multiLineSymbols, inlineSymbols) {
    this.multiLineSymbols = multiLineSymbols
    this.inlineSymbols = inlineSymbols
  }

  convert (value) {
    if (!value) {
      return value
    }
    const lines = value.split('\n')
    let resultLines = []
    for (let i = 0; i < lines.length;) {
      let multilineFound = false
      for (let j = 0; j < this.multiLineSymbols.length && !multilineFound; j++) {
        const sym = this.multiLineSymbols[j]
        if (sym.regex.test(lines[i])) {
          if (sym.preFormatting) {
            let tempLines = [sym.startMarkup]
            for (let k = i + 1; (k < lines.length) && !multilineFound; k++) {
              if (sym.regex.test(lines[k])) {
                multilineFound = true
                tempLines.push(sym.endMarkup)
                i = k
                resultLines = resultLines.concat(tempLines)
              } else {
                tempLines.push(lines[k])
              }
            }
          } else {
            let tempLines = [sym.startMarkup]
            for (let k = i; k < lines.length && !multilineFound; k++) {
              if (sym.regex.test(lines[k])) {
                tempLines.push(lines[k].replace(sym.regex, (_, innerString, other) => {
                  return `${sym.lineStartMarkup}${this.convertInline(innerString)}${sym.lineEndMarkup}`
                }))
              } else {
                tempLines.push(sym.endMarkup)
                multilineFound = true
                i = k - 1
                resultLines = resultLines.concat(tempLines)
              }
            }
          }
        }
      }
      if (!multilineFound) {
        resultLines.push(this.convertInline(lines[i]))
      }
      i++
    }

    return resultLines.join('\n')
  }

  convertInline (value) {
    if (!value) {
      return value
    }
    let result = ''
    for (let i = 0; i < value.length;) {
      for (let s = 0; s < this.inlineSymbols.length; s++) {
        const sym = this.inlineSymbols[s]
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
