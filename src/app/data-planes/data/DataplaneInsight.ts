import { DiscoverySubscriptionCollection } from '@/app/subscriptions/data'
import type {
  DataPlaneInsight as PartialDataplaneInsight,
} from '@/types/index.d'
export type DataplaneInsight = PartialDataplaneInsight & DiscoverySubscriptionCollection & {}
export const DataplaneInsight = {
  fromObject(item: PartialDataplaneInsight | undefined): DataplaneInsight {
    return {
      ...item,
      ...DiscoverySubscriptionCollection.fromArray(item?.subscriptions),
    }
  },
}
