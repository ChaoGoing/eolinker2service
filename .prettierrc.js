const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  semi: false,
  printWidth: 120,
  endOfLine: 'auto'
}
