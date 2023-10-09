import { TOKENS } from '@/services/tokens'
import { createInjections } from '@/services/utils'
export { useEnv, useI18n, useDataSourcePool } from '@/app/application'
export { useRouter } from '@/app/vue'

export const [
  useNav,
  useKumaApi,
  useLogger,
] = createInjections(
  TOKENS.nav,
  TOKENS.api,
  TOKENS.logger,
)
