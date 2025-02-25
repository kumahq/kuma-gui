/** @returns {import('stylelint').Config} */
function createStylelintConfig() {
  return {
    extends: [
      'stylelint-config-html',
      'stylelint-config-recommended-scss',
      'stylelint-config-recommended-vue/scss',
    ],
    plugins: [
      '@stylistic/stylelint-plugin',
      '@kong/design-tokens/stylelint-plugin',
    ],
    ignoreFiles: [
      'dist/**/*',
    ],
    rules: {
      '@stylistic/selector-combinator-space-before': 'always',
      '@stylistic/selector-combinator-space-after': 'always',
      '@kong/design-tokens/use-proper-token': [
        true,
        {
          disableFix: true,
          severity: 'error',
        },
      ],
      'no-duplicate-selectors': [null],
    },
  }
}

module.exports = {
  createStylelintConfig,
}
