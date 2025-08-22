import type { ZoneEgressOverview } from './data'
import type { Features } from '@kumahq/settings/can'
import type { Env } from '@kumahq/settings/env'
export const features = (_env: Env['var']): Features => {
  return {
    'use zone-egress-unified-resource-naming': (_can, zoneEgressOverview: Partial<ZoneEgressOverview>) => {
      return Boolean(zoneEgressOverview.zoneEgressInsight?.metadata?.features?.includes('feature-unified-resource-naming'))
    },
  }
}
