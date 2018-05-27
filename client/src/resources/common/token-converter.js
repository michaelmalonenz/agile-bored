export class TokenConverter {
  constructor (symbolList) {
    this.symbolList = symbolList
  }

  convert (value) {
    if (value == null) {
      return value
    }
    const syms = []
    let i = 0
    while (i < value.length) {
      for (let s = 0; s < this.symbolList.length; s++) {
        const sym = this.symbolList[s]
        if (value.substring(i, sym.len) === sym.value) {
          syms.push({ index: i, symbol: sym })
          i += sym.len
        } else {
          i += 1
        }
      }
    }

    return value
  }
}
