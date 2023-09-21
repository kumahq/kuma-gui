import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
// eslint-disable-next-line import/no-named-as-default
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { defineConfig } from 'cypress'
import cypressFailFast from 'cypress-fail-fast/plugin'
import dotenv from 'dotenv'
import fs from 'node:fs'

const env = dotenv.config().parsed as {[key: string]: string}

Object.entries({
  // default base URL for testing against
  KUMA_BASE_URL: 'http://localhost:5681/gui',
}).forEach(([key, d]: [string, string]) => {
  env[key] = process.env[key] ?? d
})

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  e2e: {
    baseUrl: env.KUMA_BASE_URL,
    specPattern: '**/*.feature',
    experimentalRunAllSpecs: true,
    // Can be turned on via CLI using `CYPRESS_video=true yarn test:browser`
    video: false,
    async setupNodeEvents(on, config) {
      // propagate env to Cypress.env
      Object.entries(env).forEach(([prop, value]) => {
        config.env[prop] = value
      })
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config)

      on('task', {
        log(message: unknown) {
          console.log(JSON.stringify(message))
          return null
        },
      })

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      )

      // Deletes videos of successful specs to avoid uploading them as GitHub artifacts
      on('after:spec', (_spec, results) => {
        if (results && results.video && results.stats.failures === 0) {
          fs.unlinkSync(results.video)
        }
      })

      cypressFailFast(on, config)

      // Make sure to return the config object as it might have been modified by the plugin.
      return config
    },
  },
})
