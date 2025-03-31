/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const config = [
  // if necessary, how to allow an exact pin for a package
  // ...eslint({
  //   versionIgnorePatterns: {
  //     dependencies: {
  //       '@kong-ui-public/entities-shared': {
  //         'type': 'string',
  //       },
  //     },
  //   },
  // }),
  ...eslint(),
  {
    ignores: [
      'public/mockServiceWorker.js',
      '.vitepress',
    ],
  },
]

module.exports = config
