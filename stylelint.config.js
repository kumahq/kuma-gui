/** @typedef {import('stylelint').Config} Config */

/** @type {Config} */ const config = {
  extends: [
    'stylelint-config-html',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  plugins: [
    '@kong/design-tokens/stylelint-plugin',
  ],
  ignoreFiles: [
    'dist/**/*',
  ],
  rules: {
    '@kong/design-tokens/use-proper-token': [true, {
      disableFix: true,
      severity: 'error',
    }],
  },
}

module.exports = config
