# @kumahq/gherkin-web

Collection of gherkin/cucumber steps specifically for testing web applications
using a choice of browser runners

## playwright

Playwright support currently leans heavily on and is setup almost the same way as:

- `playwright-bdd` <https://github.com/vitalets/playwright-bdd>

```js
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

export default defineConfig({
  testDir: defineBddConfig({
    features: 'sample.feature',
    steps: 'playwright/main.ts',
  }),
  reporter: 'html',
});
```

The main difference is that your `steps:` setting should point to the file that
imports and uses `@kumahq/gherkin-web/playwright`


```js
// playwright/main.ts

import { setupSteps } from '@kumahq/gherkin-web/playwright'

// ...

setupSteps({
  // ...options
})

```

## cypress

Cypress support currently leans heavily on:

- `@badeball/cypress-cucumber-preprocessor`
- `bahmutov/cypress-esbuild-preprocessor`

Both `setupNodeEvents` and `createEsBuildBundlerPlugin` are wrappers over those
two modules. Therefore you can pretty much use the same documentation as for
[@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/quick-start.md)

In your `cypress.config.ts` file/config you should include a `setupNodeEvents`
hook containing the following:

```ts
import { setupNodeEvents, createEsbuildBundlerPlugin as createGherkinPlugin } from '@kumahq/gherkin-web/cypress/node'
// ...
async setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await setupNodeEvents(on, config)
  on(
    'file:preprocessor',
    createEsbuildBundler({
      plugins: [
        createGherkinPlugin(config),
        // ... other plugins
      ],
    }),
  )
  //
  return config
}

```

You can then use the `package.json`
[configuration](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/configuration.md)
to add a "main" entrypoint for `@kumahq/gherkin-web` steps.

```json
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": [
      "./cypress/main.ts"
    ]
  }
```

```ts
import { setupSteps } from '@kumahq/gherkin-web/cypress/browser'
setupSteps({
  mock: {}, // your mocks
})
```


