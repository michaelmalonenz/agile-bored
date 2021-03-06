/* global describe, it, expect, beforeEach */
import { MarkdownValueConverter } from '../../../../src/resources/value-converters/markdown-valueconverter'

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

  it('can convert an inline formatted snippet', function () {
    const input = 'this is `an inline` string'

    const output = this.converter.toView(input)

    expect(output).toEqual('this is <span class="md-inline-code">an inline</span> string')
  })

  it('can convert a multiline formatted snippet', function () {
    const input = 'this is a string\n```\nThat has a\nmultiline thingy\nin it\n```'

    const output = this.converter.toView(input)

    expect(output).toEqual('this is a string\n<div><span class="md-multiline-code">That has a\nmultiline thingy\nin it\n</span></div>')
  })

  it('can handle markdown finishing on the last character', function () {
    const input = 'This is a *bold move*'

    const output = this.converter.toView(input)

    expect(output).toBe('This is a <span class="md-bold">bold move</span>')
  })

  it('can handle an unordered list with dashes', function () {
    const input = 'This is a\n - list\n - that\n - has\n - no order\nand stuff'

    const output = this.converter.toView(input)

    expect(output).toBe('This is a\n<ul class="md-unordered-list"><li>list</li><li>that</li><li>has</li><li>no order</li></ul>\nand stuff')
  })

  it('can handle an unordered list with asterisks', function () {
    const input = 'This is a\n * list\n * that\n * has\n * no order\nand stuff'

    const output = this.converter.toView(input)

    expect(output).toBe('This is a\n<ul class="md-unordered-list"><li>list</li><li>that</li><li>has</li><li>no order</li></ul>\nand stuff')
  })

  it('can handle an unordered list of just one line', function () {
    const input = 'This is a\n * list\n'

    const output = this.converter.toView(input)

    expect(output).toBe('This is a\n<ul class="md-unordered-list"><li>list</li></ul>\n')
  })

  it('can handle a link', function () {
    const input = 'This has [a link](https://www.agilebored.com) in it and stuff'

    const output = this.converter.toView(input)

    expect(output).toBe('This has <a href="https://www.agilebored.com" target="_blank">a link</a> in it and stuff')
  })

  it('can handle an image', function () {
    const input = 'This has ![an image](https://www.agilebored.com) in it and stuff'

    const output = this.converter.toView(input)

    expect(output).toBe('This has <img src="https://www.agilebored.com" alt="an image"> in it and stuff')
  })

  it('can handle a blockquote', function () {
    const input = 'This has ![an image](https://www.agilebored.com) in it and stuff'

    const output = this.converter.toView(input)

    expect(output).toBe('This has <img src="https://www.agilebored.com" alt="an image"> in it and stuff')
  })

  it('can handle a blockquote with embedded styles', function () {
    const input = 'This has\n> a blockquote in it and stuff\n'

    const output = this.converter.toView(input)

    expect(output).toBe('This has\n<blockquote>a blockquote in it and stuff</blockquote>\n')
  })
})
