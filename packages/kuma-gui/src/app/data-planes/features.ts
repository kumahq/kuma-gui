import type { DataplaneOverview } from '@/app/data-planes/data'
import type { Mesh } from '@/app/meshes/data'
import type { Features } from '@kumahq/settings/can'
import type { Env } from '@kumahq/settings/env'
export const features = (_env: Env['var']) => {
  return {
    'use transparent-proxying': (_can: unknown, dataplaneOverview: DataplaneOverview) => {
      // TODO: the feature `bind-outbounds` is not implemented yet and the name might change, double check again when implemented
      // TODO: `dataplane.networking.transparentProxying` is deprecated and will be removed soon. Still checking for users that still use it.
      return ('transparentProxying' in dataplaneOverview.dataplane.networking) ||
        new Set(dataplaneOverview.dataplaneInsight.metadata.features).intersection(new Set(['feature-transparent-proxy-in-dataplane-metadata', 'bind-outbounds'])).size > 0
    },
    'use unified-resource-naming': (_can: unknown, { dataPlaneOverview, mesh }: { dataPlaneOverview: DataplaneOverview, mesh: Mesh }) => {
      return mesh.meshServices.mode === 'Exclusive' && dataPlaneOverview.dataplaneType === 'standard' && dataPlaneOverview.dataplaneInsight.metadata.features.includes('feature-unified-resource-naming')
    },
  }
}
declare module '@/app/application' {
  export interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
