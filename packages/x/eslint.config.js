/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from '@kumahq/config'

const config = [
  ...eslint({}),
]

export default config
