import { DiscoverySubscriptionCollection, Subscription } from '@/app/subscriptions/data'
import type { DataPlaneInsight } from '@/types'
import type { components } from '@kumahq/kuma-http-api'

// TODO: revisit when fixed: `dataplaneInsight.subscriptions` and `dataplaneInsight.mTLS` from OAS are slightly incorrect, therefore omitting for the moment and keep using custom types
type OasDataplaneInsight = NonNullable<NonNullable<components['responses']['GetDataplaneOverviewResponse']['content']['application/json']>['dataplaneInsight']>
type PartialDataPlaneInsight = Omit<OasDataplaneInsight, 'subscriptions' | 'mTLS'> & DataPlaneInsight & {
  metadata?: {
    features?: string[]
  }
}

export const DataplaneInsight = {
  fromObject(item?: PartialDataPlaneInsight) {
    const collection = DiscoverySubscriptionCollection.fromArray(item?.subscriptions)
    return {
      ...(item ?? {}),
      ...collection,
      subscriptions: collection?.subscriptions?.map((sub) => {
        return {
          ...sub,
          instanceId: sub.controlPlaneInstanceId,
          instanceVersion: sub.version?.kumaDp?.version,
        } satisfies Subscription
      }) ?? [],
      // ensure features is always an array
      metadata: {
        ...item?.metadata,
        features: item?.metadata?.features ?? [],
      },
    }
  },
}
export type DataplaneInsight = ReturnType<typeof DataplaneInsight.fromObject>
