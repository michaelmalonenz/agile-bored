import {TokenConverter} from '../common/token-converter'

const MULTILINE_SYMBOLS = [
  {
    name: 'MULTILINE_CODE',
    regex: /^```.*/,
    startMarkup: '<div class="md-multiline-code">',
    endMarkup: '</div>',
    lineStartMarkup: '',
    lineEndMarkup: '',
    preFormatting: true
  },
  {
    name: 'UNORDERED_LIST',
    regex: /^\s*(?:\*|-)\s+(.*)/,
    startMarkup: '<ul>',
    endMarkup: '</ul>',
    lineStartMarkup: '<li>',
    lineEndMarkup: '</li>',
    preFormatting: false
  },
  {
    name: 'ORDERED_LIST',
    regex: /^\s*\d+\.\s*(.*)/,
    startMarkup: '<ol>',
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
    regex: /^!\[(.*?)]\((.*?)\)/,
    replacer: function (_, altText, url) {
      return `<img src="${url}" alt="${altText}">`
    },
    additionalCharCount: 14,
    preFormatting: false
  },
  {
    name: 'LINK',
    regex: /^\[(.*?)]\((.*?)\)/,
    replacer: function (_, display, href) {
      return `<a href="${href}" target="_blank">${display}</a>`
    },
    additionalCharCount: 27,
    preFormatting: false
  }
]

export class MarkdownValueConverter {

  toView (value) {
    return new TokenConverter(MULTILINE_SYMBOLS, INLINE_SYMBOLS).convert(value)
  }

  fromView (value) {
    return value
  }
}
