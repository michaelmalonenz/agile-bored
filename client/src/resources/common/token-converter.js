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
            let tempResult = sym.startMarkup
            for (let k = i + 1; (k < lines.length) && !multilineFound; k++) {
              if (sym.regex.test(lines[k])) {
                multilineFound = true
                tempResult += sym.endMarkup
                i = k
                resultLines.push(tempResult)
              } else {
                tempResult += (lines[k] + '\n')
              }
            }
          } else {
            let tempResult = sym.startMarkup
            for (let k = i; k < lines.length && !multilineFound; k++) {
              if (sym.regex.test(lines[k])) {
                tempResult += lines[k].replace(sym.regex, (_, innerString, other) => {
                  return `${sym.lineStartMarkup}${this.convertInline(innerString)}${sym.lineEndMarkup}`
                })
              } else {
                tempResult += sym.endMarkup
                multilineFound = true
                i = k - 1
                resultLines.push(tempResult)
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
        if (sym.regex) {
          const val = value.substring(i)
          if (sym.regex.test(val)) {
            const res = val.replace(sym.regex, sym.replacer)
            i += (res.length - sym.additionalCharCount)
            result += res
            s = 0
          }
        } else {
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
                  result += this.convertInline(innerValue)
                }
                result += sym.endHtml
                i = j + sym.endToken.length
                s = 0
              } else {
                j++
              }
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
