/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const config = [
  ...eslint({
    versionIgnorePatterns: {
      dependencies: {
        '@kong-ui-public/entities-shared': {
          'type': 'string',
        },
      },
    },
  }),
  {
    ignores: [
      'public/mockServiceWorker.js',
      '.vitepress',
    ],
  },
]

module.exports = config
