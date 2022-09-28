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
  ignorePatterns: [
    'node_modules',
    'dist',
  ],
  plugins: ['vue', 'import', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'standard', '@vue/typescript'],
  rules: {
    // Turns off some non-TypeScript rules in favor of their specific TypeScript rules to avoid false negatives:
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': 'error',

    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
  },
}

module.exports = config
