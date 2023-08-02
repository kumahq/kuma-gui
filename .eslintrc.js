/** @typedef {import('eslint').ESLint.ConfigData} Config */

// Taken from https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/utils/inline-non-void-elements.json.
const INLINE_NON_VOID_ELEMENTS = [
  'a',
  'abbr',
  'audio',
  'b',
  'bdi',
  'bdo',
  'canvas',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'iframe',
  'ins',
  'kbd',
  'label',
  'map',
  'mark',
  'noscript',
  'object',
  'output',
  'picture',
  'q',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'time',
  'u',
  'var',
  'video',
]

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
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'standard', '@vue/typescript', 'plugin:import/recommended', 'plugin:import/typescript'],
  settings: {
    'import/resolver': {
      typescript: true,
      alias: {
        map: [
          ['@', './src'],
        ],
      },
    },
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'import/no-named-as-default-member': 'off',
    'import/order': ['error', {
      groups: [
        ['builtin', 'external'],
        ['internal', 'parent', 'sibling', 'index', 'object', 'type'],
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue/singleline-html-element-content-newline': ['error', {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: ['router-link', 'pre', ...INLINE_NON_VOID_ELEMENTS],
        }],
        // Reason: https://github.com/vuejs/eslint-plugin-vue/issues/2259
        'vue/no-setup-props-destructure': 'off',
      },
    },
    {
      files: ['*.ts', '*.vue'],
      rules: {
        // Avoids false errors like “'NodeListOf' is not defined”.
        'no-undef': 'off',
        // Turns off some non-TypeScript rules in favor of their specific TypeScript rules to avoid false negatives:
        indent: 'off',
        '@typescript-eslint/indent': ['error', 2],

        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': 'error',

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [process.env.LINTER_MODE === 'strict' ? 'error' : 'warn', {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        }],

        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',

        '@typescript-eslint/type-annotation-spacing': ['error', {
          before: false,
          after: true,
          overrides: {
            arrow: {
              before: true,
            },
          },
        }],
      },
    },
  ],
}

module.exports = config
