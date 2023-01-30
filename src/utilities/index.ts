import { TOKENS, createInjections } from '@/services'

export const [
  useEnv,
] = createInjections(TOKENS.env)
