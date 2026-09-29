import { DiscoverySubscriptionCollection } from '@/app/subscriptions/data'
import type { components } from '@kumahq/kuma-http-api'

type KumaDataplaneInsight = NonNullable<components['schemas']['DataplaneOverview']['dataplaneInsight']> & {
  metadata?: {
    features?: string[]
  }
}

export const DataplaneInsight = {
  fromObject(item?: KumaDataplaneInsight) {
    const collection = DiscoverySubscriptionCollection.fromArray(item?.subscriptions)
    return {
      ...(item ?? {}),
      ...collection,
      // ensure features is always an array
      metadata: {
        ...item?.metadata,
        features: item?.metadata?.features ?? [],
      },
    }
  },
}
export type DataplaneInsight = ReturnType<typeof DataplaneInsight.fromObject>
