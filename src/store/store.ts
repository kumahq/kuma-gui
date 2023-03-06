import type { State } from './storeConfig'
import { get, TOKENS } from '@/services'
import type { Store } from 'vuex'

export function useStore(): Store<State> {
  return get(TOKENS.store)
}
