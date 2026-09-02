/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from '@kumahq/config'

const config = [
  ...eslint(),
  {
    'ignores': ['v2.d.ts', 'kuma', 'generated'],
  },
]

export default config
