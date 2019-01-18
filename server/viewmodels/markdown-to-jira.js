const TokenConverter = require('./token-converter')

const MULTILINE_SYMBOLS = [
  {
    name: 'MULTILINE_CODE',
    regex: /^```.*/,
    startMarkup: '{code}\n',
    endMarkup: '{code}\n',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: true
  },
  {
    name: 'UNORDERED_LIST',
    regex: /^\s*(?:\*|-)\s+(.*)/,
    startMarkup: '',
    endMarkup: '',
    lineStartMarkup: '- ',
    lineEndMarkup: '\n',
    preFormatting: false
  },
  {
    name: 'ORDERED_LIST',
    regex: /^\s*\d+\.\s*(.*)/,
    startMarkup: '',
    endMarkup: '',
    lineStartMarkup: ' # ',
    lineEndMarkup: '\n',
    preFormatting: false
  },
  {
    name: 'BLOCKQUOTE',
    regex: /^>\s*(.*)/,
    startMarkup: '<blockquote>',
    endMarkup: '</blockquote>',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: false
  }
]

const INLINE_SYMBOLS = [
  {
    name: 'INLINE_CODE',
    startToken: '`',
    endToken: '`',
    startMarkup: '{{',
    endMarkup: '}}',
    preFormatting: true
  },
  {
    name: 'BOLD',
    startToken: '*',
    endToken: '*',
    startMarkup: '*',
    endMarkup: '*',
    preFormatting: false
  },
  {
    name: 'ITALIC',
    startToken: '_',
    endToken: '_',
    startMarkup: '_',
    endMarkup: '_',
    preFormatting: false
  },
  {
    name: 'STRIKETHROUGH',
    startToken: '~~',
    endToken: '~~',
    startMarkup: '-',
    endMarkup: '-',
    preFormatting: false
  },
  {
    name: 'IMAGE',
    regex: /^!\[(.*?)\]\((.*?)!\)/,
    replacer: function (str, regex) {
      let matchLength = 0
      const markup = str.replace(regex, (match, altText, imageName) => {
        matchLength = match.length
        return `!${imageName}|${altText}!`
      })
      return {
        markup: markup,
        matchLength: matchLength
      }
    },
    preFormatting: false
  },
  {
    name: 'LINK',
    regex: /^\[(.*?)\]\((.*?)\)/,
    replacer: function (str, regex) {
      let matchLength = 0
      const markup = str.replace(regex, (match, display, href) => {
        matchLength = match.length
        return `[${display}|${href}]`
      })
      return {
        markup: markup,
        matchLength: matchLength
      }
    },
    preFormatting: false
  },
  {
    name: 'HEADING',
    regex: /^(#+)\s(.*)/,
    replacer: function (str, regex) {
      let matchLength = 0
      const markup = str.replace(regex, (match, hLevel, headingText) => {
        matchLength = match.length
        return `h${hLevel.length}. ${headingText}`
      })
      return {
        markup: markup,
        matchLength: matchLength
      }
    },
    preFormatting: false
  }
]

module.exports = class MarkdownToJira {
  static convert (value) {
    return new TokenConverter(MULTILINE_SYMBOLS, INLINE_SYMBOLS).convert(value)
  }
}
