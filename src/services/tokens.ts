import type KumaApi from '@/services/kuma-api/KumaApi'
import type { RestClient } from '@/services/kuma-api/RestClient'
import { token } from '@/services/utils'

export const TOKENS = {
  httpClient: token<RestClient>('httpClient'),
  api: token<KumaApi>('KumaApi'),
}
