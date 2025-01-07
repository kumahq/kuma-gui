const { createEslintConfig } = require('./eslint.config.cjs')
const { createStylelintConfig } = require('./stylelint.config.cjs')

module.exports = {
  eslint: createEslintConfig,
  stylelint: createStylelintConfig,
}
