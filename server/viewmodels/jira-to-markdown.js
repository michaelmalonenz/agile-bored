const TokenConverter = require('./token-converter')

const MULTILINE_SYMBOLS = [
  {
    name: 'MULTILINE_CODE',
    regex: /^\{code\}.*$/,
    startMarkup: '```',
    endMarkup: '```',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: true
  },
  {
    name: 'MULTILINE_PREFORMATTED',
    regex: /^\{noformat\}.*$/,
    startMarkup: '```',
    endMarkup: '```',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: true
  },
  {
    name: 'UNORDERED_LIST',
    regex: /^\s*(?:\*|-)\s+(.*)$/,
    startMarkup: '',
    endMarkup: '',
    lineStartMarkup: ' - ',
    lineEndMarkup: '',
    preFormatting: false
  },
  {
    name: 'ORDERED_LIST',
    regex: /^\s*#\s*(.*)$/,
    startMarkup: '',
    endMarkup: '',
    lineStartMarkup: ' 1. ',
    lineEndMarkup: '',
    preFormatting: false
  },
  {
    name: 'BLOCKQUOTE',
    regex: /^>\s*(.*)$/,
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
    regex: /^!\[(.*?)]\((.*?)\)/,
    replacer: function (_, altText, url) {
      return `[!${url}|${altText}]`
    },
    additionalCharCount: 4,
    preFormatting: false
  },
  {
    name: 'LINK',
    regex: /^\[(.*?)]\((.*?)\)/,
    replacer: function (_, display, href) {
      return `[${display}|${href}]`
    },
    additionalCharCount: 3,
    preFormatting: false
  }
]

module.exports = class JiraToMarkdown {
  static convert (value) {
    return new TokenConverter(MULTILINE_SYMBOLS, INLINE_SYMBOLS).convert(value)
  }
}
