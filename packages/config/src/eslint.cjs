const { dirname } = require('path')
const { readFileSync: read } = require('fs')
const $config = dirname(require.resolve('@kumahq/config'))

const packageSchema = JSON.parse(read(`${$config}/package.schema.json`).toString())

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

/**
 * @param {{ tsConfigPath?: string, componentIgnorePatterns?: string[], versionIgnorePatterns: Record<string, unknown> }} [options]
 * @returns {import('eslint').ESLint.ConfigData}
 */
function createEslintConfig(
  {
    tsConfigPath = 'tsconfig.json',
    componentIgnorePatterns = [],
    versionIgnorePatterns = {}
  } = {
    tsConfigPath: 'tsconfig.json',
    componentIgnorePatterns: [],
    versionIgnorePatterns: {}
  }
) {

  ((properties) => {
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach((item) => {
      properties[item].patternProperties = {
        ...properties[item].patternProperties,
        ...versionIgnorePatterns[item] ?? {}
      }
    })
  })(packageSchema.properties)

  return {
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
      'src/types/auto-generated.d.ts',
    ],
    plugins: ['vue', 'import', '@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'standard',
      '@vue/typescript',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:json-schema-validator/recommended'
    ],
    settings: {
      'import/resolver': {
        typescript: {
          project: tsConfigPath,
        },
      },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'multiline-ternary': 'off',
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
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      'padded-blocks': 'off',
      'no-unreachable': 'error',
      'json-schema-validator/no-invalid': ['error', {
        useSchemastoreCatalog: false,
        mergeSchemas: true,
        schemas: [
          {
            fileMatch: ['package.json'],
            // our schema allows for ignoring individual dependencies if required
            // see ./package.schema.json patternProperties examples
            schema: packageSchema
          }
        ]
      }]
    },
    overrides: [
      {
        files: ['*.vue'],
        rules: {
          'vue/no-console': 'error',
          'vue/attributes-order': ['error', {
            order: [
              'DEFINITION',
              'LIST_RENDERING',
              'CONDITIONALS',
              'RENDER_MODIFIERS',
              'GLOBAL',
              'UNIQUE',
              'TWO_WAY_BINDING',
              'OTHER_DIRECTIVES',
              'OTHER_ATTR',
              'EVENTS',
              'SLOT',
              'CONTENT',
            ],
            alphabetical: false,
          }],
          'vue/singleline-html-element-content-newline': ['error', {
            ignoreWhenNoAttributes: true,
            ignoreWhenEmpty: true,
            ignores: ['router-link', 'pre', ...INLINE_NON_VOID_ELEMENTS],
          }],
          'vue/no-v-html': 'off',
          // Reason: https://github.com/vuejs/eslint-plugin-vue/issues/2259
          'vue/no-setup-props-destructure': 'off',
          'vue/comma-dangle': ['error', 'always-multiline'],
          'vue/no-restricted-static-attribute': ['error',
            {
              key: 'data-test-id',
              message: 'Using "data-test-id" is not allowed. Use "data-testid" instead.',
            },
          ],
          'vue/no-restricted-v-bind': ['error',
            {
              argument: 'data-test-id',
              message: 'Using "data-test-id" is not allowed. Use "data-testid" instead.',
            },
          ],
          'vue/no-undef-components': ['error', {
            // Globally-registered components must be ignored here (https://eslint.vuejs.org/rules/no-undef-components.html)
            ignorePatterns: [
              // HTML
              'search',
              // vue-router
              'RouterView',
              // @kong/kongponents
              'K[A-Z].*',
              //
              'X[A-Z].*',
              'Kuma[A-Z].*',
              // @kong-ui-public/i18n
              'I18nT',
              // Application
              'AppView',
              'DataLoader',
              'DataSource',
              'DataSink',
              'DataCollection',
              'RouteView',
              'RouteTitle',
              ...componentIgnorePatterns,
            ],
          }],
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
          '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          }],

          /* temporarily allow function, variable and export hoisting */
          'no-use-before-define': 'off',
          '@typescript-eslint/no-use-before-define': ['error', {
            functions: false,
            classes: true,
            variables: false,
            allowNamedExports: true,
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

          '@typescript-eslint/member-delimiter-style': ['error', {
            singleline: {
              delimiter: 'comma',
            },
            multiline: {
              delimiter: 'none',
            },
          }],
        },
      },
    ]
  }
}

module.exports = {
  createEslintConfig,
}
