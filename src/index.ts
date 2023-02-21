import { Component, createApp, InjectionKey } from 'vue'
import { RouteRecordRaw } from 'vue-router'

import { createRouter } from './router/router'

import type { EnvVars } from '@/services/env/Env'
import type { ClientConfigInterface } from '@/store/modules/config/config.types'
import type { Store } from 'vuex'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { State } from '@/store/storeConfig'

/**
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 *
 * @returns a factory creating an initialized Vue application with installed store and router without mounting it.
 */
export function useApp(
  env: (key: keyof EnvVars) => string,
  routes: RouteRecordRaw[],
  logger: {setup: (config: ClientConfigInterface) => void},
  kumaApi: KumaApi,
  store: Store<State>,
  storeKey: InjectionKey<Store<State>>,
) {
  document.title = `${env('KUMA_PRODUCT_NAME')} Manager`
  // during development setBaseUrl also optionally installs MSW mocking via
  // MockKumaApi
  kumaApi.setBaseUrl(env('KUMA_API_URL'))

  if (import.meta.env.PROD) {
    (async () => {
      const config = await kumaApi.getConfig()
      logger.setup(config)
    })()
  }

  return async (App: Component) => {
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
    const router = await createRouter(routes, store, env('KUMA_BASE_PATH'))

    app.use(router)

    return app
  }
}
