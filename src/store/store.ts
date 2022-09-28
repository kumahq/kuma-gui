import { InjectionKey } from 'vue'
import { createStore, useStore as useVuexStore, Store } from 'vuex'

import { storeConfig, State } from './index'

export const storeKey: InjectionKey<Store<State>> = Symbol('store')

export const store = createStore<State>(storeConfig)

export function useStore(): Store<State> {
  return useVuexStore(storeKey)
}
