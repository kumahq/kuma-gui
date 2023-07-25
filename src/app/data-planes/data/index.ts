import { DataplaneNetworking } from './networking'
import { Version } from './version'
import type {
  PaginatedApiListResponse as CollectionResponse,
} from '@/types/api.d'
import type {
  DataPlaneOverview as OriginalDataplaneOverview,
  DataPlane as OriginalDataplane,
  DataPlaneInsight as OriginalDataplaneInsight,
  DiscoverySubscription,
  KumaDpVersion,
  EnvoyVersion,
} from '@/types/index.d'
import {
  compatibilityKind,
  COMPATIBLE,
} from '@/utilities/dataplane'

export type Dataplane = OriginalDataplane & {
  networking: DataplaneNetworking
  tags: { label: string, value: string }[]
  service: string
  status: string
  protocol: string
  zone: string
}
export type DataplaneInsight = OriginalDataplaneInsight & {
  subscriptions: DiscoverySubscription[];
}

export type DataplaneOverview = OriginalDataplaneOverview & {
  status: string
  // dependencies: Record<string, string>
  lastUpdated: Date
  version: string
  compatible: boolean,
  dataplane: Dataplane
  dataplaneInsight: DataplaneInsight
}

type Label = {
  label: string
  value: string
}
type BuildVersion = KumaDpVersion | EnvoyVersion | { version: string}
///

export const Dataplane = {
  fromJSONCollection(collection: CollectionResponse<unknown>): CollectionResponse<Dataplane> {
    collection.items = collection.items.map((item: unknown) => {
      return Dataplane.fromJSON(item)
    })
    return collection as CollectionResponse<Dataplane>
  },
  fromJSON(object: unknown): Dataplane {
    const item = {
      ...(object as OriginalDataplane),
    } as Dataplane
    // make sure networking.inbound is at least an empty array
    item.networking = DataplaneNetworking.fromJSON(item.networking)
    //
    item.tags = getTags(item)
    item.service = getTag(item, 'kuma.io/service')
    item.protocol = getTag(item, 'kuma.io/protocol')
    item.zone = getTag(item, 'kuma.io/zone')
    return item
  },
}

export const DataplaneInsight = {
  fromJSON(object: unknown): DataplaneInsight {
    const original = object as OriginalDataplaneInsight
    const item = {
      ...original,
    } as DataplaneInsight

    return {
      ...item as DataplaneInsight,
      subscriptions: Array.isArray(original?.subscriptions) ? original.subscriptions : [],
    }
  },
}
export const DataplaneOverview = {
  fromJSONCollection(collection: CollectionResponse<unknown>): CollectionResponse<DataplaneOverview> {
    collection.items = collection.items.map((item: unknown) => {
      return DataplaneOverview.fromJSON(item)
    })
    return collection as CollectionResponse<DataplaneOverview>
  },
  fromJSON(object: unknown): DataplaneOverview {
    const item = {
      ...(object as OriginalDataplaneOverview),
    } as DataplaneOverview
    // make sure dataplane.networking.inbound is at least an empty array
    item.dataplane = Dataplane.fromJSON(item.dataplane)
    // make sure subscriptions is at least an empty array
    item.dataplaneInsight = DataplaneInsight.fromJSON(item.dataplaneInsight || {})
    //
    item.status = getStatus(item)
    const dependencies = getDependencies(item.dataplaneInsight)
    item.lastUpdated = getLastUpdated(item.dataplaneInsight)
    item.version = dependencies.kumaDp.version
    const compatibility = compatibilityKind(
      {
        kumaDp: dependencies.kumaDp as KumaDpVersion,
        envoy: dependencies.envoy as EnvoyVersion,
        dependencies: {} as Record<string, string>,
      },
    ).kind
    item.compatible = compatibility !== COMPATIBLE
    return item
  },
}

// utilities
function getStatus(data: DataplaneOverview): string {
  const dataplane = data.dataplane
  const dataplaneInsight = data.dataplaneInsight
  const errors = dataplane.networking.inbound
    .filter(item => {
      // @TODO
      return item.health && !item.health.ready
    })
    .map((item: {port: any; tags: {[x: string]: any;};}) => `Inbound on port ${item.port} is not ready (kuma.io/service: ${item.tags['kuma.io/service']})`)

  let status: string
  switch (true) {
    case dataplane.networking.inbound.length === 0:
      status = 'online'
      break
    // if errors and inbounds are equal, even if they are both 0
    // then we are offline
    case errors.length === dataplane.networking.inbound.length:
      status = 'offline'
      break
    // otherwise any errors at all, we are degraded
    case errors.length > 0:
      status = 'partially_degraded'
      break
    default: {
      const proxyOnline = dataplaneInsight.subscriptions.some(
        (item: DiscoverySubscription) => item.connectTime && item.connectTime.length && !item.disconnectTime,
      )
      status = proxyOnline ? 'online' : 'offline'
    }
  }
  return status
}
function getTag(dataplane: Dataplane, key: string): string {
  return getTags(dataplane).find((item: { label: string }) => item.label === key)?.value ?? ''
}
function getTags(dataplane: Dataplane): Label[] {
  let tags: [string, string][] = []
  switch (true) {
    case dataplane.networking.inbound.length > 0:
      tags = dataplane.networking.inbound
        .filter((inbound) => 'tags' in inbound)
        .flatMap((inbound) => Object.entries(inbound.tags))
      break
    case Object.keys(dataplane.networking.gateway?.tags || {}).length > 0:
    // default:
      // gateway data plane has no inbounds, but has tags embedded in gateway branch
      tags = Object.entries(dataplane.networking.gateway?.tags ?? {})
      break
  }

  const uniqueTags = Array.from(new Set(tags.map(([key, value]) => `${key}=${value}`)))
  uniqueTags.sort((tagPairA: string, tagPairB: string) => tagPairA.localeCompare(tagPairB))
  return uniqueTags
    .map((tagPair: string) => tagPair.split('='))
    .map(([label, value]) => ({ label, value }))
}
function getVersion(item: DataplaneInsight): Version {
  return item.subscriptions.length === 0 ? Version.fromJSON({}) : Version.fromJSON(item.subscriptions[item.subscriptions.length - 1].version)
}

function getDependencies(item: DataplaneInsight): Record<string, BuildVersion> {
  const version = getVersion(item)
  const deps: Record<string, BuildVersion> = {}
  if (version.envoy) {
    deps.envoy = version.envoy
  }
  if (version.kumaDp) {
    deps.kumaDp = version.kumaDp
  }
  if (version.dependencies) {
    Object.entries(version.dependencies).forEach(([key, value]) => {
      deps[key] = {
        version: value,
      }
    })
  }
  return deps
}

function getLastUpdated(insight: DataplaneInsight): Date {
  return new Date(Math.max(
    ...insight.subscriptions.reduce((prev: number[], item: DiscoverySubscription) => {
      return prev.concat([new Date(item.status?.lastUpdateTime)?.getTime() ?? 0])
    }, []),
  ))
}
