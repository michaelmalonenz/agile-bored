import {TokenConverter} from '../common/token-converter'

const MARKDOWN_SYMBOLS = [
  {
    name: 'MULTILINE_CODE',
    startToken: '```',
    endToken: '```',
    startHtml: '<div class="md-multiline-code">',
    endHtml: '</div>',
    preFormatting: true
  },
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
    name: 'TASK_LIST',
    startToken: ' - [ ]',
    endToken: '\n',
    startHtml: '<input type="checkbox">',
    endHtml: '',
    preFormatting: false
  }
]

export class MarkdownValueConverter {

  toView (value) {
    return new TokenConverter(MARKDOWN_SYMBOLS).convert(value)
  }

  fromView (value) {
    return value
  }
}
