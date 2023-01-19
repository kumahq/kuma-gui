import { createApp } from 'vue'
import { addLicense, useTheme } from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

import { createRouter } from './router/router'
import { kumaApi } from './api/kumaApi'
import { setupDatadog } from './utilities/setupDatadog'
import { storeKey, store } from './store/store'
import { useEnv } from '@/utilities'
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
  const env = useEnv()

  document.title = `${env('KUMA_PRODUCT_NAME')} Manager`
  kumaApi.setBaseUrl(env('KUMA_API_URL'))

  if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
    // The combination of reading the environment variable and using dynamic import
    // ensures that msw isn’t actually bundled with the production application.
    const { setupMockWorker } = await import('./api/setupMockWorker')

    setupMockWorker(kumaApi.baseUrl)
  }

  const app = createApp(App)

  app.use(store, storeKey)

  await Promise.all([
    // Fetches basic resources before setting up the router and mounting the
    // application. This is mainly needed to properly redirect users to the
    // onboarding flow in the appropriate scenarios.
    store.dispatch('bootstrap'),
    // Loads available policy types in order to populate the necessary information used for titling/breadcrumbing and policy lookups in the app.
    store.dispatch('fetchPolicyTypes'),
  ])

  const router = await createRouter(env('KUMA_BASE_PATH'))

  app.use(router)

  app.mount('#app')
}

initializeVue()

if (import.meta.env.VITE_AMCHARTS_LICENSE) {
  addLicense(import.meta.env.VITE_AMCHARTS_LICENSE)
}
