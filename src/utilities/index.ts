import { TOKENS } from '@/services/production'
import { createInjections } from '@/services/utils'

export const [
  useEnv,
  useNav,
  useKumaApi,
  useStore,
  useRouter,
] = createInjections(TOKENS.env, TOKENS.nav, TOKENS.api, TOKENS.store, TOKENS.router)
