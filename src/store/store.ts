import { get, TOKENS } from '@/services'
import { useStore as useVuexStore, Store } from 'vuex'

import type { State } from './'

export const store: Store<State> = get(TOKENS.store)

export function useStore(): Store<State> {
  return useVuexStore(get(TOKENS.storeKey))
}
