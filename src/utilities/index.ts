import { TOKENS } from '@/app/kuma'
import { createInjections } from '@/services/utils'

export { useEnv, useI18n } from '@/app/application'
export { useRouter } from '@/app/vue'

export const [
  useKumaApi,
] = createInjections(
  TOKENS.api,
)
