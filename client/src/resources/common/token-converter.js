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

  convert (value) {
    if (value) {
      return value
        .replace(/```\s([\s\S]*?)```/g, (_, innerString) => {
          return `<div class="md-multiline-code">${innerString}</div>`
        })
        .replace(/`(.*?)`/g, (_, innerString) => {
          return `<span class="md-inline-code">${innerString}</span>`
        })
    }
  }
}
