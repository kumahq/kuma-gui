/** @typedef {import('eslint').ESLint.ConfigData} Config */

/** @type {Config} */ const config = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['vue', 'import', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'standard', '@vue/typescript'],
  rules: {
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
  },
}

module.exports = config
