import type { DataplaneOverview } from '@/app/data-planes/data'
import type { Features } from '@kumahq/settings/can'

export const features = () => {
  return {
    'use transparent-proxying': (_can: unknown, dataplaneOverview: DataplaneOverview) => {
      switch (true) {
        // TODO: `dataplane.networking.transparentProxying` is deprecated and will be removed soon. Still checking for users that still use it.
        case 'transparentProxying' in dataplaneOverview.dataplane.networking:
          return true
        case new Set(dataplaneOverview.dataplaneInsight.metadata.features).intersection(new Set(['feature-transparent-proxy-in-dataplane-metadata', 'feature-bind-outbounds'])).size > 0:
          return true
      }
    },
  }
}
declare module '@/app/application' {
  export interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
