/** @returns {import('stylelint').Config} */
export function createStylelintConfig() {
  return {
    extends: [
      'stylelint-config-html',
      'stylelint-config-recommended-scss',
      'stylelint-config-recommended-vue/scss',
    ],
    plugins: [
      '@stylistic/stylelint-plugin',
      '@kong/stylelint-plugin-design-tokens',
    ],
    ignoreFiles: [
      'dist/**/*',
    ],
    rules: {
      '@kong/stylelint-plugin-design-tokens/use-proper-token': [
        true,
        {
          disableFix: true,
          severity: 'error',
        },
      ],
      '@kong/stylelint-plugin-design-tokens/token-var-usage': true,
      '@stylistic/selector-combinator-space-before': 'always',
      '@stylistic/selector-combinator-space-after': 'always',
      'no-duplicate-selectors': [null],
    },
  }
}
