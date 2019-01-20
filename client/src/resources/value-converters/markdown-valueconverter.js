import { TokenConverter } from '../common/token-converter'

const MULTILINE_SYMBOLS = [
  {
    name: 'MULTILINE_CODE',
    regex: /^```.*/,
    startMarkup: '<div><span class="md-multiline-code">',
    endMarkup: '</span></div>',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: true
  },
  {
    name: 'UNORDERED_LIST',
    regex: /^\s*(?:\*|-)\s+(.*)$/,
    startMarkup: '<ul class="md-unordered-list">',
    endMarkup: '</ul>',
    lineStartMarkup: '<li>',
    lineEndMarkup: '</li>',
    preFormatting: false
  },
  {
    name: 'ORDERED_LIST',
    regex: /^\s*\d+\.\s*(.*)$/,
    startMarkup: '<ol class="md-ordered-list">',
    endMarkup: '</ol>',
    lineStartMarkup: '<li>',
    lineEndMarkup: '</li>',
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
    startHtml: '<span class="md-inline-code">',
    endHtml: '</span>',
    preFormatting: true
  },
  {
    name: 'BOLD',
    startToken: '*',
    endToken: '*',
    startHtml: '<span class="md-bold">',
    endHtml: '</span>',
    preFormatting: false
  },
  {
    name: 'ITALIC',
    startToken: '_',
    endToken: '_',
    startHtml: '<span class="md-italic">',
    endHtml: '</span>',
    preFormatting: false
  },
  {
    name: 'STRIKETHROUGH',
    startToken: '~~',
    endToken: '~~',
    startHtml: '<span class="md-strikethrough">',
    endHtml: '</span>',
    preFormatting: false
  },
  {
    name: 'IMAGE',
    regex: /^(?:!\[(.*?)\]\((.*?)\))/,
    replacer: function (str, regex) {
      let matchLength = 0
      let markup = str
      str.replace(regex, (match, altText, url) => {
        matchLength = match.length
        markup = `<img src="${url}" alt="${altText}">`
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
    regex: /^(?:\[(.*?)\]\((.*?)\))/,
    replacer: function (str, regex) {
      let matchLength = 0
      let markup = str
      str.replace(regex, (match, display, href) => {
        matchLength = match.length
        markup = `<a href="${href}" target="_blank">${display}</a>`
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
    regex: /^(#+)\s+(.*)/,
    replacer: function (str, regex) {
      let matchLength = 0
      let markup = str
      str.replace(regex, (match, headerLevel, heading) => {
        matchLength = match.length
        markup = `<h${headerLevel.length}>${heading}</h${headerLevel.length}>`
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

export class MarkdownValueConverter {
  toView (value) {
    if (value) {
      const str = value.replace(/(?:\r\n|\r|\n)/g, '\n')
      return new TokenConverter(MULTILINE_SYMBOLS, INLINE_SYMBOLS).convert(str)
    }
    return value
  }

  fromView (value) {
    return value
  }
}
