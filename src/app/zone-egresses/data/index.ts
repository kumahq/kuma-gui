import { DiscoverySubscriptionCollection } from '@/app/subscriptions/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneEgressOverview as PartialZoneEgressOverview,
  ZoneEgress as PartialZoneEgress,
  ZoneEgressInsight as PartialZoneEgressInsight,
} from '@/types/index.d'

type PartialInternalZoneEgress = PartialZoneEgressOverview['zoneEgress']

// TODO(jc) Theres probably a better way to not copy/pasta this i.e. make `Entity` composable
type InternalZoneEgress = {
  socketAddress: string
} & PartialInternalZoneEgress

export type ZoneEgress = {
  config: PartialZoneEgress
  socketAddress: string
} & PartialZoneEgress
// end TODO

export type ZoneEgressInsight = PartialZoneEgressInsight & DiscoverySubscriptionCollection & {}

export type ZoneEgressOverview = PartialZoneEgressOverview & {
  zoneEgress: InternalZoneEgress
  zoneEgressInsight: ZoneEgressInsight
  state: 'online' | 'offline'
}
// TODO(jc) Theres probably a better way to not copy/pasta this i.e. make `Entity` composable
const InternalZoneEgress = {
  fromObject: (item: PartialInternalZoneEgress): InternalZoneEgress => {
    return {
      ...item,
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
    }
  },
}

export const ZoneEgress = {
  fromObject: (item: PartialZoneEgress): ZoneEgress => {
    return {
      ...item,
      config: item,
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
    }
  },
}
// end TODO
export const ZoneEgressInsight = {
  fromObject: (item: PartialZoneEgressInsight | undefined): ZoneEgressInsight => {
    return {
      ...item,
      ...DiscoverySubscriptionCollection.fromArray(item?.subscriptions),
    }
  },
}
export const ZoneEgressOverview = {
  fromObject: (item: PartialZoneEgressOverview): ZoneEgressOverview => {
    const zoneEgressInsight = ZoneEgressInsight.fromObject(item.zoneEgressInsight)
    const zoneEgress = InternalZoneEgress.fromObject(item.zoneEgress)
    return {
      ...item,
      zoneEgressInsight,
      zoneEgress,
      // it is possible to have zoneEgresses on a 'disabled' zone but we don't
      // want to do anything special about that just now at least
      state: typeof zoneEgressInsight.connectedSubscription !== 'undefined' ? 'online' : 'offline',
    }
  },
  fromCollection: (collection: CollectionResponse<PartialZoneEgressOverview>): CollectionResponse<ZoneEgressOverview> => {
    return {
      ...collection,
      items: Array.isArray(collection.items) ? collection.items.map(ZoneEgressOverview.fromObject) : [],
    }
  },
}
