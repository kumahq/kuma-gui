import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { defineConfig } from 'cypress'
import cypressFailFast from 'cypress-fail-fast/plugin'
import dotenv from 'dotenv'
import esbuild from 'esbuild'
import fs from 'node:fs'

function createVuePlugin(
): esbuild.Plugin {
  return {
    name: 'vue',
    setup(build) {
      build.onLoad({ filter: /\.vue$/ }, async () => {
        return {
          contents: 'export default ""',
          loader: 'js',
        }
      })
    },
  }
}
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
          plugins: [
            createEsbuildPlugin(config),
            createVuePlugin(),
          ],
        }),
      )

      on('after:spec', (_spec, results) => {
        // Deletes videos of successful specs to avoid uploading them as GitHub artifacts
        if (results && results.video && results.stats.failures === 0) {
          fs.unlinkSync(results.video)
        }

        // Extract the error message of a failing test to log it via the special GitHub Actions annotation for errors. This way, the workflow summary doesn’t just show “Process completed with exit code 1”.
        if (results && results.stats.failures > 0) {
          for (const test of results.tests.filter((test) => test.state === 'failed')) {
            if (test.displayError) {
              const newLineIndex = test.displayError.indexOf('\n')
              const message = test.displayError.substring(0, newLineIndex !== -1 ? newLineIndex : test.displayError.length)
              console.log(`::error file=${results.spec.relative}::${message}`)
            }
          }
        }
      })

      cypressFailFast(on, config)

      // Make sure to return the config object as it might have been modified by the plugin.
      return config
    },
  },
})
