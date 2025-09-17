/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from '@kumahq/config'

const config = [
  ...eslint(),
  {
    'ignores': ['index.d.ts'],
  },
]

export default config
