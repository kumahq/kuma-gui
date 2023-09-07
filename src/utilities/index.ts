import { TOKENS } from '@/services/tokens'
import { createInjections } from '@/services/utils'
export { useI18n } from '@/app/application'

export const [
  useEnv,
  useNav,
  useKumaApi,
  useStore,
  useRouter,
  useLogger,
  useDataSourcePool,
] = createInjections(
  TOKENS.env,
  TOKENS.nav,
  TOKENS.api,
  TOKENS.store,
  TOKENS.router,
  TOKENS.logger,
  TOKENS.dataSourcePool,
)
