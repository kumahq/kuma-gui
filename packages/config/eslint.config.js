/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from './src/index.ts'

const config = [
  ...eslint({}),
]

export default config
