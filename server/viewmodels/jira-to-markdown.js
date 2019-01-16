const TokenConverter = require('./token-converter')

const MULTILINE_SYMBOLS = [
  {
    name: 'MULTILINE_CODE',
    regex: /^\{code\}.*/,
    startMarkup: '```\n',
    endMarkup: '```\n',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: true
  },
  {
    name: 'MULTILINE_PREFORMATTED',
    regex: /^\{noformat\}.*/,
    startMarkup: '```\n',
    endMarkup: '```\n',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: true
  },
  {
    name: 'UNORDERED_LIST',
    regex: /^\s*(?:\*|-)\s+(.*)$/,
    startMarkup: '',
    endMarkup: '',
    lineStartMarkup: '- ',
    lineEndMarkup: '\n',
    preFormatting: false
  },
  {
    name: 'ORDERED_LIST',
    regex: /^\s*#\s*(.*)$/,
    startMarkup: '',
    endMarkup: '',
    lineStartMarkup: ' 1. ',
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
    startToken: '{{',
    endToken: '}}',
    startHtml: '`',
    endHtml: '`',
    preFormatting: true
  },
  {
    name: 'BOLD',
    startToken: '*',
    endToken: '*',
    startHtml: '*',
    endHtml: '*',
    preFormatting: false
  },
  {
    name: 'ITALIC',
    startToken: '_',
    endToken: '_',
    startHtml: '_',
    endHtml: '_',
    preFormatting: false
  },
  {
    name: 'STRIKETHROUGH',
    startToken: '~~',
    endToken: '~~',
    startHtml: '-',
    endHtml: '-',
    preFormatting: false
  },
  {
    name: 'IMAGE',
    regex: /^!(.*?)\|(.*?)!/,
    replacer: function (str, regex) {
      let matchLength = 0
      const markup = str.replace(regex, (match, imageName, altText) => {
        matchLength = match.length
        return `![${altText}](${imageName})`
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
    regex: /^\[(.*?)\|(.*?)\]/,
    replacer: function (str, regex) {
      let matchLength = 0
      const markup = str.replace(regex, (match, display, href) => {
        matchLength = match.length
        return `[${display}](${href})`
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
    regex: /^[hH](\d)\.(.*)$/,
    replacer: function (str, regex) {
      let matchLength = 0
      const markup = str.replace(regex, (match, hLevel, headingText) => {
        matchLength = match.length
        return `${'#'.repeat(Number(hLevel))}${headingText}`
      })
      return {
        markup: markup,
        matchLength: matchLength
      }
    },
    preFormatting: false
  }
]

module.exports = class JiraToMarkdown {
  static convert (value) {
    if (value) {
      const str = value.replace(/(?:\r\n|\r|\n)/g, '\n')
      return new TokenConverter(MULTILINE_SYMBOLS, INLINE_SYMBOLS).convert(str)
    }
  }
}
