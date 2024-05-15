/** @typedef {import('eslint').ESLint.ConfigData} Config */

/** @type {Config} */ const config = {
  root: true,
  extends: ['./.eslintrc.cjs'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      files: ['cypress.config.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}

module.exports = config
