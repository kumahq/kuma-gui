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

export function useBootstrap() {
  return async () => {
  }
}
