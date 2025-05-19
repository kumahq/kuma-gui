import type { Features } from '@/app/application/services/can'
import type Env from '@/app/application/services/env/Env'
import type { DataplaneOverview } from '@/app/data-planes/data'
export const features = (_env: Env['var']): Features => {
  return {
    'use transparent-proxying': (_can, dataplaneOverview: DataplaneOverview) => {
      // TODO: the feature `bind-outbounds` is not implemented yet and the name might change, double check again when implemented
      // TODO: `dataplane.networking.transparentProxying` is deprecated and will be removed soon. Still checking for users that still use it.
      return ('transparentProxying' in dataplaneOverview.dataplane.networking) ||
        new Set(dataplaneOverview.dataplaneInsight.metadata.features).intersection(new Set(['feature-transparent-proxy-in-dataplane-metadata', 'bind-outbounds'])).size > 0
    },
  }
}
