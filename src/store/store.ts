import { get, TOKENS } from '@/services'
import type { Store } from 'vuex'

import type { State } from './storeConfig'

export function useStore(): Store<State> {
  return get(TOKENS.store)
}
