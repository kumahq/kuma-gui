import type { ZoneIngressOverview } from './data'
import type { Features } from '@kumahq/settings/can'
import type { Env } from '@kumahq/settings/env'
export const features = (_env: Env['var']): Features => {
  return {
    'use zone-ingress-unified-resource-naming': (_can, zoneIngressOverview: Partial<ZoneIngressOverview>) => {
      return Boolean(zoneIngressOverview.zoneIngressInsight?.metadata?.features?.includes('feature-unified-resource-naming'))
    },
  }
}
