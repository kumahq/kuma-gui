import { TOKENS } from '@/services/tokens'
import { createInjections } from '@/services/utils'
export { useEnv, useI18n } from '@/app/application'
export { useRouter } from '@/app/vue'

export const [
  useKumaApi,
] = createInjections(
  TOKENS.api,
)
