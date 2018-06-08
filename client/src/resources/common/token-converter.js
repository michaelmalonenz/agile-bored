export class TokenConverter {
  constructor (symbolList) {
    this.symbolList = symbolList
  }

  // convert (value) {
  //   if (value == null) {
  //     return value
  //   }
  //   const syms = []
  //   let i = 0
  //   while (i < value.length) {
  //     for (let s = 0; s < this.symbolList.length; s++) {
  //       const sym = this.symbolList[s]
  //       const matchString = value.substring(i, sym.len)
  //       if (matchString === sym.startToken) {
  //         syms.push({ index: i, symbol: sym, isStart: true })
  //         i += sym.len
  //       } else if (matchString === sym.endToken) {
  //         syms.push({ index: i, symbol: sym, isStart: false })
  //         i += sym.len
  //       } else {
  //         i++
  //       }
  //     }
  //   }
  //   // Ensure the list of syms has matching pairs, dropping ones that don't??
  //   i = 0
  //   let result = ''
  //   while (i < value.length) {
  //     for (let s = 0; s < syms.length; s++) {
  //     }
  //   }
  //   return result
  // }

  // _parseSymbolList (syms) {
  //   // how do I build an AST?  Some sort of binary tree, right?
  //   for (let i = 0; i < syms.length; i++) {

  //   }
  // }

  /**
   * I could do proper recursive descent, right?  Start with the start tag,
   * search to the end to find an end tag, if we find it, call the function
   * with the inside string, if not overriding, else continue.
   */

  convert (value) {
    if (!value) {
      return value
    }
    let result = ''
    for (let i = 0; i < value.length;) {
      if (value.substring(i, i + 3) === '```') {
        let foundClosingTag = false
        for (let j = i + 3; (j < value.length && !foundClosingTag);) {
          if (value.substring(j, j + 3) === '```') {
            result += '<div class="md-multiline-code">'
            result += value.substring(i + 3, j).trim()
            result += '</div>'
            i = j + 3
            foundClosingTag = true
          }
          j++
        }
        if (!foundClosingTag) {
          i++
        }
      } else if (value.substring(i, i + 1) === '`') {
        let foundClosingTag = false
        for (let j = i + 1; (j < value.length && !foundClosingTag);) {
          if (value.substring(j, j + 1) === '`') {
            result += '<span class="md-inline-code">'
            result += value.substring(i + 1, j)
            result += '</span>'
            i = j + 1
            foundClosingTag = true
          }
          j++
        }
      } else {
        result += value.substring(i, i + 1)
        i++
      }
    }
    return result
  }

  // convert (value) {
  //   if (value) {
  //     return value
  //       .replace(/```\s([\s\S]*?)```/g, (_, innerString) => {
  //         return `<div class="md-multiline-code">${innerString}</div>`
  //       })
  //       .replace(/`(.*?)`/g, (_, innerString) => {
  //         return `<span class="md-inline-code">${innerString}</span>`
  //       })
  //   }
  // }
}
