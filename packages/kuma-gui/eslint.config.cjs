/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const config = [
  ...eslint({}),
  {
    ignores: [
      'public/mockServiceWorker.js',
      '.vitepress',
    ],
  },
]

module.exports = config
