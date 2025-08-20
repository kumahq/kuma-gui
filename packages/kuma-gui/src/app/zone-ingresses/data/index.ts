import { Resource } from '@/app/resources/data/Resource'
import { DiscoverySubscriptionCollection } from '@/app/subscriptions/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneIngressOverview as PartialZoneIngressOverview,
  ZoneIngress as PartialZoneIngress,
  ZoneIngressInsight as PartialZoneIngressInsight,
} from '@/types/index.d'
export type { AvailableService } from '@/types/index.d'

type PartialInternalZoneIngress = PartialZoneIngressOverview['zoneIngress']

export type ZoneIngressInsight = PartialZoneIngressInsight & DiscoverySubscriptionCollection & {}

export const ZoneIngress = {
  fromObject: (item: PartialZoneIngress) => {
    return {
      ...item,
      listenerAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}_${item.networking.port}` : '',

      config: item,
      availableServices: Array.isArray(item.availableServices) ? item.availableServices : [],
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      advertisedSocketAddress: item.networking?.advertisedAddress && item.networking?.advertisedPort ? `${item.networking.advertisedAddress}:${item.networking.advertisedPort}` : '',
      networking: {
        ...item.networking,
        inboundAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      },
    }
  },
}
export const ZoneIngressInsight = {
  fromObject: (item: PartialZoneIngressInsight | undefined): ZoneIngressInsight => {
    return {
      ...item,
      ...DiscoverySubscriptionCollection.fromArray(item?.subscriptions),
      metadata: {
        ...item?.metadata,
        features: item?.metadata?.features ?? [],
      },
    }
  },
}
// TODO(jc) Theres probably a better way to not copy/pasta this i.e. make `Entity` composable
const InternalZoneIngress = {
  fromObject: (item: PartialInternalZoneIngress) => {
    return {
      ...item,
      listenerAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}_${item.networking.port}` : '',
      availableServices: Array.isArray(item.availableServices) ? item.availableServices : [],
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      advertisedSocketAddress: item.networking?.advertisedAddress && item.networking?.advertisedPort ? `${item.networking.advertisedAddress}:${item.networking.advertisedPort}` : '',
      networking: {
        ...item.networking,
        inboundAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      },
    }
  },
}

export const ZoneIngressOverview = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject: (item: PartialZoneIngressOverview) => {
    const zoneIngressInsight = ZoneIngressInsight.fromObject(item.zoneIngressInsight)
    const zoneIngress = InternalZoneIngress.fromObject(item.zoneIngress)
    const zoneIngressConfig = ZoneIngress.fromObject({
      type: 'ZoneIngress',
      name: item.name,
      creationTime: item.creationTime,
      modificationTime: item.modificationTime,
      mesh: item.mesh,
      ...item.zoneIngress,
    }).config
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}

    return {
      ...item,
      id: item.name,
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      labels,
      zoneIngressInsight,
      zoneIngress,
      config: zoneIngressConfig,
      // it is possible to have zoneIngresses on a 'disabled' zone but we don't
      // want to do anything special about that just now at least
      state: typeof zoneIngressInsight.connectedSubscription !== 'undefined' ? 'online' as const : 'offline' as const,
    }
  },
  fromCollection: (collection: CollectionResponse<PartialZoneIngressOverview>) => {
    return {
      ...collection,
      items: Array.isArray(collection.items) ? collection.items.map(ZoneIngressOverview.fromObject) : [],
    }
  },
}

export type ZoneIngressOverview = ReturnType<typeof ZoneIngressOverview.fromObject>
export type ZoneIngress = ReturnType<typeof ZoneIngress.fromObject>
