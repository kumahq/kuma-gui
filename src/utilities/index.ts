import { TOKENS, createInjections } from '@/services'

export const [
  useEnv,
  useNav,
  useKumaApi,
] = createInjections(TOKENS.env, TOKENS.nav, TOKENS.api)
