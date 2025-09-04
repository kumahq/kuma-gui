import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { defineConfig } from 'cypress'
import cypressFailFast from 'cypress-fail-fast/plugin'
import installLogsPrinter from 'cypress-terminal-report/src/installLogsPrinter'
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

export const cypress = (env: Record<string, string>) => {
  return defineConfig({
    viewportWidth: 1366,
    viewportHeight: 768,
    experimentalMemoryManagement: true,
    e2e: {
      baseUrl: env.KUMA_BASE_URL,
      specPattern: '**/*.feature',
      experimentalRunAllSpecs: true,
      // Can be turned on via CLI using `CYPRESS_video=true npm run test:browser`
      video: false,
      async setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {

        // propagate env to Cypress.env
        Object.entries(env).forEach(([prop, value]) => {
          config.env[prop] = value
        })
        // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
        await addCucumberPreprocessorPlugin(on, config)

        on('task', {
          log(message: unknown) {
            console.info(JSON.stringify(message))

            return null
          },
        })

        on(
          'file:preprocessor',
          createBundler({
            plugins: [
              createEsbuildPlugin(config) as esbuild.Plugin,
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
                const trimmedMessage = test.displayError
                  .replace(/^Error: The following error originated from your application code, not from Cypress.*\n/, '')
                  .replace(/^AssertionError: cypress-fail-on-console-error.*\n/, '')
                  .trim()
                  .replace(/^> /, '')
                const newLineIndex = trimmedMessage.indexOf('\n')
                const message = trimmedMessage.substring(0, newLineIndex !== -1 ? newLineIndex : trimmedMessage.length)
                console.info(`::error file=${results.spec.relative}::${message}`)
              }
            }
          }
        })

        installLogsPrinter(on, {
          logToFilesOnAfterRun: true,
          printLogsToConsole: 'always',
        })
        cypressFailFast(on, config)

        // Make sure to return the config object as it might have been modified by the plugin.
        return config
      },
    },

  })
}
