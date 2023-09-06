import Kongponents from '@kong/kongponents'
import { Component, createApp } from 'vue'
import { Store, storeKey } from 'vuex'

import type { State } from '@/store/storeConfig'
import type { Router } from 'vue-router'

/**
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 *
 * @returns a factory creating an initialized Vue application with installed store and router without mounting it.
 */
export function useApp(
  store: Store<State>,
  router: Router,
) {
  return async (App: Component) => {
    const app = createApp(App)
    app.use(store, storeKey)
    app.use(router)
    app.use(Kongponents)
    return app
  }
}

export function useBootstrap(_store: Store<State>) {
  return async (_isAllowedToMakeApiCalls: boolean = true) => {
  }
}
