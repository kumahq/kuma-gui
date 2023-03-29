import { TOKENS, createInjections } from '@/services'

export const [
  useEnv,
  useNav,
  useKumaApi,
  useStore,
  useRouter,
] = createInjections(TOKENS.env, TOKENS.nav, TOKENS.api, TOKENS.store, TOKENS.router)
