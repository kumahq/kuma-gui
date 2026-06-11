import { Kri } from '@/app/kuma/kri'
import { Resource } from '@/app/resources/data/Resource'
import { DiscoverySubscriptionCollection, Subscription } from '@/app/subscriptions/data'
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
  fromObject: (item: PartialZoneIngressInsight | undefined) => {
    const collection = DiscoverySubscriptionCollection.fromArray(item?.subscriptions)
    return {
      ...item,
      ...collection,
      subscriptions: collection.subscriptions.map((sub) => {
        return {
          ...sub,
          instance: {
            id: sub.controlPlaneInstanceId,
            version: sub.version?.kumaDp?.version ?? '',
          },
        } satisfies Subscription
      }),
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
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    const kri = Kri.toString({ shortName: 'zi', mesh, zone, namespace, name })

    return {
      ...item,
      kri,
      name,
      mesh,
      labels,
      creationTime: item.creationTime ?? '',
      modificationTime: item.modificationTime ?? '',
      // aliases
      id,
      namespace,
      zone,

      zoneIngressInsight,
      zoneIngress,
      config: {
        ...ZoneIngress.fromObject({
          type: 'ZoneIngress',
          name: item.name,
          mesh: item.mesh,
          creationTime: item.creationTime,
          modificationTime: item.modificationTime,
          ...item.zoneIngress,
        }).config,
        kri,
        ...(typeof item.labels !== 'undefined' ? { labels: item.labels } : {}),
      },
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
