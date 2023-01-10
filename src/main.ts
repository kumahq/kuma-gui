import { createApp } from 'vue'
import { addLicense, useTheme } from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

import { createRouter } from './router/router'
import { kumaApi } from './api/kumaApi'
import { PATH_CONFIG_DEFAULT } from './pathConfigDefault'
import { PathConfig } from './types/index'
import { setupDatadog } from './utilities/setupDatadog'
import { storeKey, store } from './store/store'
import App from './app/App.vue'

if (import.meta.env.PROD) {
  setupDatadog()
}

useTheme(am4themesAnimated)

/**
 * Initializes and mounts the Vue application.
 *
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 */
async function initializeVue() {
  document.title = import.meta.env.VITE_NAMESPACE + ' Manager'

  const pathConfig = readPathConfigFromDom()
  kumaApi.setBaseUrl(pathConfig.apiUrl)

  if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
    // The combination of reading the environment variable and using dynamic import
    // ensures that msw isn’t actually bundled with the production application.
    const { setupMockWorker } = await import('./api/setupMockWorker')

    setupMockWorker(kumaApi.baseUrl)
  }

  const app = createApp(App)

  app.use(store, storeKey)

  await Promise.all([
    // Fetches basic resources before setting up the router and mounting the application. This is mainly needed to properly redirect users to the onboarding flow in the appropriate scenarios.
    store.dispatch('bootstrap'),
    // Loads available policies in order to populate the necessary route information.
    // i.e. pluralDisplayName and amounts of policyTypes
    store.dispatch('fetchPolicies'),
  ])

  const router = await createRouter(pathConfig.baseGuiPath)

  app.use(router)

  app.mount('#app')
}

/**
 * Reads the path config object from a JSON string found in a special script tag that’s populated during server-side rendering of the Vue application’s index.html file.
 */
function readPathConfigFromDom(): PathConfig {
  const pathConfigNode = document.querySelector('#kuma-config')

  if (pathConfigNode instanceof HTMLScriptElement) {
    try {
      return JSON.parse(pathConfigNode.innerText.trim())
    } catch {
      // Handled by falling back to a default value.
    }
  }

  // Falls back to a sensible default when encountering a malformed JSON payload or non-replaced template.
  return PATH_CONFIG_DEFAULT
}

initializeVue()

if (import.meta.env.VITE_AMCHARTS_LICENSE) {
  addLicense(import.meta.env.VITE_AMCHARTS_LICENSE)
}
