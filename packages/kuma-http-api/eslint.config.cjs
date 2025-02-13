/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const config = [
  ...eslint(),
  {
    'ignores': ['index.d.ts'],
  },
]

module.exports = config
