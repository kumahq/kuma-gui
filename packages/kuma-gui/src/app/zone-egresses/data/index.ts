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
  fromObject: (item: PartialZoneEgressOverview) => {
    const zoneEgressInsight = ZoneEgressInsight.fromObject(item.zoneEgressInsight)
    const zoneEgress = InternalZoneEgress.fromObject(item.zoneEgress)
    const zoneEgressConfig = ZoneEgress.fromObject({
      type: 'ZoneEgress',
      name: item.name,
      creationTime: item.creationTime,
      modificationTime: item.modificationTime,
      mesh: item.mesh,
      ...item.zoneEgress,
    }).config
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}

    return {
      ...item,
      config: zoneEgressConfig,
      id: item.name,
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      labels,
      zoneEgressInsight,
      zoneEgress,
      // it is possible to have zoneEgresses on a 'disabled' zone but we don't
      // want to do anything special about that just now at least
      state: typeof zoneEgressInsight.connectedSubscription !== 'undefined' ? 'online' as const : 'offline' as const,
    }
  },
  fromCollection: (collection: CollectionResponse<PartialZoneEgressOverview>) => {
    return {
      ...collection,
      items: Array.isArray(collection.items) ? collection.items.map(ZoneEgressOverview.fromObject) : [],
    }
  },
}

export type ZoneEgressOverview = ReturnType<typeof ZoneEgressOverview.fromObject>
