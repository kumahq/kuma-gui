import { Component, createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { Store, storeKey } from 'vuex'

import { createRouter } from './router/router'
import type { EnvVars } from '@/services/env/Env'
import type { State } from '@/store/storeConfig'

/**
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 *
 * @returns a factory creating an initialized Vue application with installed store and router without mounting it.
 */
export function useApp(
  env: (key: keyof EnvVars) => string,
  routes: RouteRecordRaw[],
  store: Store<State>,
) {
  return async (App: Component) => {
    const app = createApp(App)
    const router = await createRouter(routes, store, env('KUMA_BASE_PATH'))
    app.use(store, storeKey)
    app.use(router)
    return app
  }
}

export function useBootstrap(store: Store<State>) {
  return async (isAllowedToMakeApiCalls: boolean = true) => {
    if (isAllowedToMakeApiCalls) {
      await Promise.all([
        // Fetches basic resources before setting up the router and mounting the
        // application. This is mainly needed to properly redirect users to the
        // onboarding flow in the appropriate scenarios.
        store.dispatch('bootstrap'),
        // Loads available policy types in order to populate the necessary
        // information used for and policy lookups in the app.
        store.dispatch('fetchPolicyTypes'),
      ])
    } else {
      store.state.defaultVisibility.appError = false
    }
  }
}
