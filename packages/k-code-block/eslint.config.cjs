/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const /** @type Config */ config = [
  ...eslint({}),
]

module.exports = config
