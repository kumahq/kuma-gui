/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('./src/index.cjs')

const config = [
  ...eslint({}),
]

module.exports = config
