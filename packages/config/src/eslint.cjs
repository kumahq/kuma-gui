const { resolve, dirname } = require('node:path')
const { readFileSync: read } = require('node:fs')
const vuePlugin = require('eslint-plugin-vue')
const { defineConfig, createConfig: vueTsEslintConfig } = require('@vue/eslint-config-typescript')
const importPlugin = require('eslint-plugin-import')
const stylistic = require('@stylistic/eslint-plugin')
const eslint = require('@eslint/js')
const nounsanitized = require('eslint-plugin-no-unsanitized')
const jsonSchemaValidatorPlugin = require('eslint-plugin-json-schema-validator')
const globals = require('globals')
const escape = require('escape-string-regexp')
const { execSync } = require('node:child_process')
const $config = dirname(require.resolve('@kumahq/config'))

const workspace = JSON.parse(
  execSync('npm query :root').toString(),
).at(0)

const packageSchema = JSON.parse(
  read(resolve(`${$config}/package.schema.json`), 'utf-8'),
)

const workflowSchema = JSON.parse(
  read(resolve(`${$config}/workflow.schema.json`), 'utf-8'),
)

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
 * @returns {import('eslint').Linter.Config[]}
 */
function createEslintConfig(
  {
    tsConfigPath = 'tsconfig.json',
    componentIgnorePatterns = [],
    versionIgnorePatterns = {},
    workspaceRoot = false,
  } = {
    tsConfigPath: 'tsconfig.json',
    componentIgnorePatterns: [],
    versionIgnorePatterns: {},
    workspaceRoot: false,
  },
) {

  // amend our package.json schema depending on arguments
  ((schema) => {
    // 1. include any ignored version patterns
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach((item) => {
      schema.properties[item].patternProperties = {
        ...schema.properties[item].patternProperties,
        ...versionIgnorePatterns[item] ?? {},
      }
    })

    // 2. Take engines from the root of kumahq/kuma-gui and make sure
    // any other workspace root using this linter use the same engines
    Object.entries(workspace.engines).forEach(([key, value]) => {
      schema.definitions[key].pattern = `^${escape(value)}$`
    })

    // 3. Any non-root package.json files shouldn't ever specify `engines`
    if (!workspaceRoot) {
      schema.properties.engines = {
        not: {},
      }
    }
  })(packageSchema)

  const vueTsConfig = defineConfig(
    ...vuePlugin.configs['flat/recommended'],
    vueTsEslintConfig(),
  )

  const importConfig = [
    importPlugin.flatConfigs.recommended,
    {
      rules: {
        'import/no-extraneous-dependencies': 'error',
      },
    },
  ]

  const jsonSchemaValidatorConfig = [
    ...jsonSchemaValidatorPlugin.configs['flat/recommended'],
    {
      rules: {
        'json-schema-validator/no-invalid': ['error', {
          useSchemastoreCatalog: false,
          mergeSchemas: true,
          schemas: [
            {
              fileMatch: ['package.json'],
              // our schema allows for ignoring individual dependencies if required
              // see ./package.schema.json patternProperties examples
              schema: packageSchema,
            },
            {
              fileMatch: ['.github/**/*.{yaml,yml}'],
              schema: workflowSchema,
            },
          ],
        }],
      },
    },
  ]

  const stylisticConfig = {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Turns off some non-TypeScript rules in favor of their specific TypeScript rules to avoid false negatives:
      indent: 'off',
      '@stylistic/indent': ['error', 2],

      'func-call-spacing': 'off',
      '@stylistic/func-call-spacing': 'error',

      '@stylistic/type-annotation-spacing': ['error', {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
          },
        },
      }],
      '@stylistic/member-delimiter-style': ['error', {
        singleline: {
          delimiter: 'comma',
        },
        multiline: {
          delimiter: 'none',
        },
      }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'never'],
    },
  }

  return [
    // when linting workspaceRoots we want to ignore
    // sub-packages which are linted separately
    workspaceRoot ? {
      ignores: workspace.workspaces,
    } : {},
    //
    eslint.configs.recommended,
    nounsanitized.configs.recommended,
    ...vueTsConfig,
    ...importConfig,
    ...jsonSchemaValidatorConfig,
    stylisticConfig,
    {
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        globals: {
          ...globals.browser,
        },
      },
      files: [
        '**/*.js',
        '**/*.ts',
        '**/*.vue',
        '**/*.json',
      ],
      ignores: [
        'dist/*',
        'node_modules/*',
      ],
      settings: {
        'import/resolver': {
          typescript: {
            project: tsConfigPath,
          },
        },
      },
      rules: {
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
        'prefer-promise-reject-errors': 'error',
      },
    },
    {
      files: ['**/*.vue'],
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
        'vue/no-v-html': 'error',
        // Reason: https://github.com/vuejs/eslint-plugin-vue/issues/2259
        'vue/no-setup-props-destructure': 'off',
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/no-restricted-static-attribute': ['error',
          {
            key: 'data-test-id',
            message: 'Using "data-test-id" is not allowed. Use "data-testid" instead.',
          },
          {
            key: 'style',
            message: 'Using "style" is not allowed. Use "v-style" instead.',
          },
        ],
        'vue/no-restricted-v-bind': ['error',
          {
            argument: 'data-test-id',
            message: 'Using "data-test-id" is not allowed. Use "data-testid" instead.',
          },
          {
            argument: 'style',
            message: 'Using "style" is not allowed. Use "v-style" instead.',
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
      files: ['**/*.ts', '**/*.vue'],
      rules: {
        // Avoids false errors like “'NodeListOf' is not defined”.
        'no-undef': 'off',

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {
          args: 'none',
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
      },
    },
    {
      // temporarily disabling the following rules
      files: ['**/*.ts', '**/*.vue'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-unused-expressions': ['error', {
          allowTernary: true,
          allowShortCircuit: true,
        }],
      },
    },
    {
      // temporarily keep supporting commonjs modules (e.g. this file)
      files: ['**/*.cjs'],
      languageOptions: {
        globals: {
          ...globals.commonjs,
        },
      },
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ]
}

module.exports = {
  createEslintConfig,
}
