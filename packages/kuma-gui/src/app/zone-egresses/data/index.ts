import { Kri } from '@/app/kuma/kri'
import { Resource } from '@/app/resources/data/Resource'
import { DiscoverySubscriptionCollection, Subscription } from '@/app/subscriptions/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneEgressOverview as PartialZoneEgressOverview,
  ZoneEgress as PartialZoneEgress,
  ZoneEgressInsight as PartialZoneEgressInsight,
} from '@/types/index.d'

type PartialInternalZoneEgress = PartialZoneEgressOverview['zoneEgress']

export type ZoneEgressInsight = PartialZoneEgressInsight & DiscoverySubscriptionCollection & {}

export const ZoneEgress = {
  fromObject: (item: PartialZoneEgress) => {
    return {
      ...item,
      config: item,
      kri: item.kri ?? '',
      id: item.name,
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      networking: {
        ...item.networking,
        inboundAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      },
    }
  },
}
export const ZoneEgressInsight = {
  fromObject: (item: PartialZoneEgressInsight | undefined) => {
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
const InternalZoneEgress = {
  fromObject: (item: PartialInternalZoneEgress) => {
    return {
      ...item,
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      networking: {
        ...item.networking,
        inboundAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
      },
    }
  },
}

export const ZoneEgressOverview = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject: (item: PartialZoneEgressOverview) => {
    const zoneEgressInsight = ZoneEgressInsight.fromObject(item.zoneEgressInsight)
    const zoneEgress = InternalZoneEgress.fromObject(item.zoneEgress)
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name
    const kri = item.kri ?? Kri.toString({ shortName: 'ze', mesh, zone, namespace, name })

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

      zoneEgressInsight,
      zoneEgress,
      // config should only contain non-defaulted values
      // because we want to show what the API responded with
      // we then copy over things that should be on the Entity, but
      // are only on the EntityOverview
      config: {
        ...ZoneEgress.fromObject({
          // bare minimum props to keep TS happy
          // plus a splat of the original Entity
          type: 'ZoneEgress',
          name: item.name,
          mesh: item.mesh,
          ...item.zoneEgress,
        }).config,
        // the things we copy over
        // kri is always missing and we always purposefully add and generate ourselves
        kri,
        // we only copy these over if they exist
        ...(typeof item.labels !== 'undefined' ? { labels: item.labels } : {}),
        ...(typeof item.creationTime !== 'undefined' ? { creationTime: item.creationTime } : {}),
        ...(typeof item.modificationTime !== 'undefined' ? { modificationTime: item.modificationTime } : {}),
      },
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
export type ZoneEgress = ReturnType<typeof ZoneEgress.fromObject>
