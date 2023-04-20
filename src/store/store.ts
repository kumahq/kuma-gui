import type { State } from './storeConfig'
import { TOKENS } from '@/services/production'
import { get } from '@/services/utils'
import type { Store } from 'vuex'

export function useStore(): Store<State> {
  return get(TOKENS.store)
}
