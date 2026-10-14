/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from '@kumahq/config'

const /** @type Config */ config = [
  ...eslint({}),
]

export default config
