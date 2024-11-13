const { createEslintConfig } = require('./eslint.cjs')
const { createStylelintConfig } = require('./stylelint.cjs')
module.exports = {
  eslint: createEslintConfig,
  stylelint: createStylelintConfig,
}
