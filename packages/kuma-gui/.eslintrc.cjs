/** @typedef {import('eslint').ESLint.ConfigData} Config */

const { eslint } = require('@kumahq/config')

/** @type {Config} */ const config = {
  ...eslint({}),
}

module.exports = config
