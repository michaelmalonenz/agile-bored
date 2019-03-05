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
    startMarkup: '`',
    endMarkup: '`',
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
    regex: /^\s?-(\S.*?\S)-\s/,
    replacer: function (str, regex, _attachments) {
      let matchLength = 0
      let markup = str
      str.replace(regex, (match, strikeThroughText) => {
        matchLength = match.length
        markup = ` ~~${strikeThroughText}~~ `
        return markup
      })
      return {
        markup: markup,
        matchLength: matchLength
      }
    },
    startMarkup: '~~',
    endMarkup: '~~',
    preFormatting: false
  },
  {
    name: 'IMAGE',
    regex: /^!(.*?)\|(.*?)!/,
    replacer: function (str, regex, attachments) {
      let matchLength = 0
      let markup = str
      str.replace(regex, (match, imageName, altText) => {
        matchLength = match.length
        for (let attachment of attachments) {
          if (attachment.filename === imageName) {
            markup = `![${altText}](${attachment.thumbnailUrl})`
            return markup
          }
        }
        markup = `![${altText}](${imageName})`
        return markup
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
    regex: /^\[(.*?)\|(.*?)]/,
    replacer: function (str, regex, _attachments) {
      let matchLength = 0
      let markup = str
      str.replace(regex, (match, display, href) => {
        matchLength = match.length
        markup = `[${display}](${href})`
        return markup
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
    replacer: function (str, regex, _attachments) {
      let matchLength = 0
      let markup = str
      str.replace(regex, (match, hLevel, headingText) => {
        matchLength = match.length
        markup = `${'#'.repeat(Number(hLevel))}${headingText}`
        return markup
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
  static convert (value, attachments) {
    if (value) {
      const str = value.replace(/(?:\r\n|\r|\n)/g, '\n')
      return new TokenConverter(MULTILINE_SYMBOLS, INLINE_SYMBOLS, attachments).convert(str)
    }
  }
}
