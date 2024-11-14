/** @typedef {import('stylelint').Config} Config */

const { stylelint } = require('@kumahq/config')

/** @type {Config} */ const config = {
  ...stylelint({}),
}

module.exports = config
