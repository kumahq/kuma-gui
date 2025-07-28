import { components } from '@kumahq/kuma-http-api'

import { DiscoverySubscriptionCollection } from '@/app/subscriptions/data'
import { DataPlaneInsight } from '@/types'

// TODO: revisit when fixed: `dataplaneInsight.subscriptions` and `dataplaneInsight.mTLS` from OAS are slightly incorrect, therefore omitting for the moment and keep using custom types
type OasDataplaneInsight = NonNullable<NonNullable<components['responses']['GetDataplaneOverviewResponse']['content']['application/json']>['dataplaneInsight']>
type PartialDataPlaneInsight = Omit<OasDataplaneInsight, 'subscriptions' | 'mTLS'> & DataPlaneInsight & {
  metadata?: {
    features?: string[]
  }
}

export const DataplaneInsight = {
  fromObject(item?: PartialDataPlaneInsight) {
    return {
      ...(item ?? {}),
      ...DiscoverySubscriptionCollection.fromArray(item?.subscriptions),
      metadata: {
        ...item?.metadata,
        features: item?.metadata?.features ?? [],
      },
    }
  },
}
export type DataplaneInsight = ReturnType<typeof DataplaneInsight.fromObject>
