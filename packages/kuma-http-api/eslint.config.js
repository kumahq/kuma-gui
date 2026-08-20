/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from '@kumahq/config'

const config = [
  ...eslint(),
  {
    'ignores': [
      'index.d.ts',
      'kuma',
      'generated',
      'v2/index.d.ts',
      'v2/kuma',
      'v2/generated',
    ],
  },
]

export default config
