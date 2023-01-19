import { TOKENS, container, createInjections } from '@/services'

export const [
  useEnv,
] = createInjections([TOKENS.env], container)
