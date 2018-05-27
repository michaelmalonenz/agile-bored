/* global describe, it, expect, beforeEach */
import {MarkdownValueConverter} from '../../../../src/resources/value-converters/markdown-valueconverter'

describe('the markdown value converter', function () {
  beforeEach(function () {
    this.converter = new MarkdownValueConverter()
  })

  it('should not fail for an undefined value', function () {
    const output = this.converter.toView(undefined)

    expect(output).toBeUndefined()
  })

  it('can convert a simple bold string', function () {
    const input = 'Some *bold* string'

    const output = this.converter.toView(input)

    expect(output).toEqual('Some <span class="md-bold">bold</span> string')
  })

  it('can convert a simple italic string', function () {
    const input = 'Some _italic_ string'

    const output = this.converter.toView(input)

    expect(output).toEqual('Some <span class="md-italic">italic</span> string')
  })

  it('can convert a nested bold and italic string', function () {
    const input = 'Some *bold _and_ italic* string'

    const output = this.converter.toView(input)

    expect(output).toEqual('Some <span class="md-bold">bold <span class="md-italic">and</span> italic</span> string')
  })
})
