/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const config = [
  ...eslint({}),
  {
    ignores: [
      'src/types/auto-generated.d.ts',
      'public/mockServiceWorker.js',
      '.vitepress',
    ],
  },
]

module.exports = config
