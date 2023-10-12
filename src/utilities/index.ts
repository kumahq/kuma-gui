import { TOKENS } from '@/services/tokens'
import { createInjections } from '@/services/utils'
export { useEnv, useI18n, useDataSourcePool } from '@/app/application'
export { useRouter } from '@/app/vue'

export const [
  useKumaApi,
  useLogger,
] = createInjections(
  TOKENS.api,
  TOKENS.logger,
)
