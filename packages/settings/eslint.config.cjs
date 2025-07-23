/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const config = [
  ...eslint(),
]

module.exports = config
