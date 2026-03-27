// eslint-disable-next-line import/no-unresolved
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
// eslint-disable-next-line import/no-unresolved
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'

import type esbuild from 'esbuild'
export const setupNodeEvents = async (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  return addCucumberPreprocessorPlugin(on, config)
}
export const createEsbuildBundlerPlugin = (config: Cypress.PluginConfigOptions) => {
  return createEsbuildPlugin(config) as esbuild.Plugin
}
