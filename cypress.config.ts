import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
// eslint-disable-next-line import/no-named-as-default
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { defineConfig } from 'cypress'
import dotenv from 'dotenv'
const env = dotenv.config().parsed as {[key: string]: string}

export default defineConfig({
  e2e: {
    specPattern: '**/*.feature',
    supportFile: false,
    experimentalRunAllSpecs: true,
    // TODO Env var
    video: false,
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions,
    ) {
      // propagate env to Cypress.env
      Object.entries(env).forEach(([prop, value]) => {
        config.env[prop] = value
      });
      // additional non-dotenv environment vars
      [
        'KUMA_BASE_URL',
      ].forEach(item => {
        config.env[item] = process.env[item]
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

      // Make sure to return the config object as it might have been modified by the plugin.
      return config
    },
  },
})
