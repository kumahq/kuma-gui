/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from '@kumahq/config'

const config = [
  ...eslint(),
  {
    'ignores': ['index.d.ts', 'kuma', 'generated'],
  },
]

export default config
