import { TOKENS, createInjections } from '@/services'

export const [
  useEnv,
  useNav,
] = createInjections(TOKENS.env, TOKENS.nav)
