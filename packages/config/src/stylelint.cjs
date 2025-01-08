/** @returns {import('stylelint').Config} */
function createStylelintConfig() {
  return {
    extends: [
      'stylelint-config-html',
      'stylelint-config-recommended-scss',
      'stylelint-config-recommended-vue/scss',
    ],
    plugins: ['@kong/design-tokens/stylelint-plugin'],
    ignoreFiles: ['dist/**/*'],
    rules: {
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
};
