const { createEslintConfig } = require('./eslint.cjs')
const { createStylelintConfig } = require('./stylelint.cjs')
const ci = require('../scripts/ci.cjs')

module.exports = {
  eslint: createEslintConfig,
  stylelint: createStylelintConfig,
  ci,
}
