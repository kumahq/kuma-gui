// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'standard'
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // error on non-newlines between object properties
    'object-property-newline': 'error',
    // disallow lines between class members
    'lines-between-class-members': ['error', 'always'],
    // disallow blank lines between certain statements
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['block', 'block-like'], next: '*' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var', 'if'] },
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'any', prev: 'directive', next: 'directive' }
    ],
    curly: 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': 'off',
    'no-mixed-operators': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'no-console': 'off',
    'no-useless-escape': 'off',
    'no-async-promise-executor': 'off'
  }
}
