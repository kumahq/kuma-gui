import { TOKENS } from '@/services/production'
import { createInjections } from '@/services/utils'

export const [
  useEnv,
  useNav,
  useKumaApi,
  useStore,
  useRouter,
  useI18n,
  useLogger,
  useDataSourcePool,
] = createInjections(
  TOKENS.env,
  TOKENS.nav,
  TOKENS.api,
  TOKENS.store,
  TOKENS.router,
  TOKENS.i18n,
  TOKENS.logger,
  TOKENS.dataSourcePool,
)
