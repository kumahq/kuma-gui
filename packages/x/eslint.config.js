/** @typedef {import('eslint').Linter.Config[]} Config */

import { eslint } from '@kumahq/config'

const config = [
  ...eslint({
    dependencyIgnorePatterns: {
      dependencies: {
        '@kong-ui-public/app-layout': {
          '$ref': '#/definitions/exactOnlyVersion',
        },
      },
    },
  }),
]


export default config
