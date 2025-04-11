import { DiscoverySubscriptionCollection } from '@/app/subscriptions/data'
import type {
  DataPlaneInsight as PartialDataplaneInsight,
} from '@/types/index.d'

export const DataplaneInsight = {
  fromObject(item?: PartialDataplaneInsight) {
    return {
      ...(item ?? {}),
      ...DiscoverySubscriptionCollection.fromArray(item?.subscriptions),
    }
  },
}
export type DataplaneInsight = ReturnType<typeof DataplaneInsight.fromObject>
