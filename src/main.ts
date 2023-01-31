import { createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'

import { createRouter } from './router/router'
import { EnvVars } from '@/services/env/Env'
import { TOKENS, get } from '@/services'
import App from './app/App.vue'

/**
 * Initializes and mounts the Vue application.
 *
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 */

async function initializeVue(
  env: (key: keyof EnvVars) => string,
  routes: readonly RouteRecordRaw[],
  logger: {setup: (enabled: boolean) => void},
) {
  const store = get(TOKENS.store)
  const kumaApi = get(TOKENS.api)

  if (import.meta.env.PROD) {
    const config = await kumaApi.getConfig()
    logger.setup(config.reports.enabled)
  }
  document.title = `${env('KUMA_PRODUCT_NAME')} Manager`
  kumaApi.setBaseUrl(env('KUMA_API_URL'))

  if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
    // The combination of reading the environment variable and using dynamic import
    // ensures that msw isn’t actually bundled with the production application.
    const { setupMockWorker } = await import('./api/setupMockWorker')

    setupMockWorker(kumaApi.baseUrl)
  }

  const app = createApp(App)

  app.use(store, get(TOKENS.storeKey))

  await Promise.all([
    // Fetches basic resources before setting up the router and mounting the
    // application. This is mainly needed to properly redirect users to the
    // onboarding flow in the appropriate scenarios.
    store.dispatch('bootstrap'),
    // Loads available policy types in order to populate the necessary information used for titling/breadcrumbing and policy lookups in the app.
    store.dispatch('fetchPolicyTypes'),
  ])

  const router = await createRouter(routes, env('KUMA_BASE_PATH'))

  app.use(router)

  app.mount('#app')
}

initializeVue(get(TOKENS.env), get(TOKENS.routes), get(TOKENS.logger))
