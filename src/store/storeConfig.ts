import { get, TOKENS } from '@/services'

import type { StoreOptions } from 'vuex'
import type { State } from './'
export { State } from './'
export const storeConfig: StoreOptions<State> = get(TOKENS.storeConfig)
