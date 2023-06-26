import { TOKENS } from '@/services/production'
import { createInjections } from '@/services/utils'

export const [
  useEnv,
  useNav,
  useKumaApi,
  useStore,
  useRouter,
  useBootstrap,
  useI18n,
  useLogger,
  useDataSource,
] = createInjections(
  TOKENS.env,
  TOKENS.nav,
  TOKENS.api,
  TOKENS.store,
  TOKENS.router,
  TOKENS.bootstrap,
  TOKENS.i18n,
  TOKENS.logger,
  TOKENS.dataSource,
)
