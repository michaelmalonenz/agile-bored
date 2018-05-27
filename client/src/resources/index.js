export function configure (config) {
  config.globalResources([
    './value-converters/newline-valueconverter',
    './value-converters/date-valueconverter',
    './value-converters/markdown-valueconverter'
  ])
}
