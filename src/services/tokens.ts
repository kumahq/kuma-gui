import type { getNavItems } from '@/app/getNavItems'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { RestClient } from '@/services/kuma-api/RestClient'
import type Logger from '@/services/logger/Logger'
import { token } from '@/services/utils'

export const TOKENS = {
  httpClient: token<RestClient>('httpClient'),
  api: token<KumaApi>('KumaApi'),
  nav: token<ReturnType<typeof getNavItems>>('nav'),
  logger: token<Logger>('logger'),
}
