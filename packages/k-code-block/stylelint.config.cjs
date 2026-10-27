/** @typedef {import('stylelint').Config} Config */

const { stylelint } = require('@kumahq/config')

const base = stylelint({})

/** @type {Config} */ const config = {
  ...base,
  rules: {
    ...base.rules,
    // KCodeBlock.vue is copied verbatim from @kong/kongponents
    'no-descending-specificity': null,
    'declaration-property-value-no-unknown': null,
  },
}

module.exports = config
