# eslint-package-constraints

ESLint package that enforces `package.json` and GitHub workflow version
constraints across a monorepo.

## Features

- Validates `package.json` files against a JSON Schema that enforces consistent
dependency version ranges and engine requirements. Defaults to preferring carat
versions but allows ignore rules
- Validates `.github/**/*.{yaml,yml}` workflow files against a schema that
enforces immutable SHA pinning for third-party actions
- Prevents non-root packages from specifying their own `engines` field
- Locks any "nested workspaces" to the same `node`/`npm` engine versions as the
"root-most" workspace

## Usage

```js
import { defineConfig } from '@kumahq/eslint-package-constraints'

export default [
  ...defineConfig({
    workspaceRoot: false, // set true if linting at the monorepo root, otherwise `engines` properties are not allowed in the package.json
    dependencyIgnorePatterns: {
      dependencies: { // we are amending prod dependencies only (other options are `devDependencies` and `peerDependencies`)
        '@kong-ui-public/app-layout': {
          '$ref': '#/definitions/exactOnlyVersion', // reuse our definition to enforce only specifying an "exact version constraint"
        },
      },
    },
  }),
]
```
