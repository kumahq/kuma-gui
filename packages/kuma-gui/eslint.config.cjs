/** @typedef {import('eslint').Linter.Config[]} Config */

const { eslint } = require('@kumahq/config')

const config = [
  ...eslint({}),
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      'src/types/auto-generated.d.ts',
      'public/mockServiceWorker.js',
      '**/.*'
    ]
  },
]

module.exports = config
