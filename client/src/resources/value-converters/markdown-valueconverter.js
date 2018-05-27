import {TokenConverter} from '../common/token-converter'

const MARKDOWN_SYMBOLS = [
  { name: 'BEG_MULTILINE_CODE', value: '```', len: 3, html: '<div class="md-multi-code">' },
  { name: 'END_MULTILINE_CODE', value: '```', len: 3, html: '</div>' },
  { name: 'BEG_INLINE_CODE', value: '`', len: 1, html: '<span class="md-inline-code">' },
  { name: 'END_INLINE_CODE', value: '`', len: 1, html: '</span>' },
  { name: 'BEG_BOLD', value: '*', len: 1, html: '<span class="md-bold">' },
  { name: 'END_BOLD', value: '*', len: 1, html: '</span>' },
  { name: 'BEG_ITALIC', value: '_', len: 1, html: '<span class="md-italic">' },
  { name: 'END_ITALIC', value: '_', len: 1, html: '</span>' }
]

export class MarkdownValueConverter {

  toView (value) {
    return new TokenConverter(MARKDOWN_SYMBOLS).convert(value)
  }

  fromView (value) {

  }
}
