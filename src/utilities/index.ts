import { TOKENS } from '@/services/production'
import { createInjections } from '@/services/utils'

export const [
  useEnv,
  useNav,
  useKumaApi,
  useStore,
  useRouter,
  useMeshRoutes,
  useBootstrap,
  useI18n,
  useGetGlobalKdsAddress,
] = createInjections(TOKENS.env, TOKENS.nav, TOKENS.api, TOKENS.store, TOKENS.router, TOKENS.meshRoutes, TOKENS.bootstrap, TOKENS.i18n, TOKENS.getGlobalKdsAddress)
