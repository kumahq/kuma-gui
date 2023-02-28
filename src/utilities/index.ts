import { TOKENS, createInjections } from '@/services'

export const [
  useEnv,
  useNav,
  useKumaApi,
  useStore,
] = createInjections(TOKENS.env, TOKENS.nav, TOKENS.api, TOKENS.store)
