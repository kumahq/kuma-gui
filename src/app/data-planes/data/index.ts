// generated protobuf or openapi imports
import { DataplaneNetworking } from './networking'
import { Dataplane as GeneratedDataplane } from '@/data/proto/mesh/v1alpha1/dataplane'
import {
  DataplaneInsight as GeneratedDataplaneInsight,
  DiscoverySubscription as GeneratedDiscoverySubscription,
  Version as GeneratedVersion,
  KumaDpVersion as GeneratedKumaDpVersion,
  EnvoyVersion as GeneratedEnvoyVersion,
} from '@/data/proto/mesh/v1alpha1/dataplane_insight'
import { DataplaneOverview as GeneratedDataplaneOverview } from '@/data/proto/mesh/v1alpha1/dataplane_overview'
// end generated protobuf or openapi imports
import type {
  PaginatedApiListResponse as CollectionResponse,
} from '@/types/api.d'

type Label = {
  label: string
  value: string
}
type Dependencies = {
  envoy?: GeneratedEnvoyVersion
  kumaDp?: GeneratedKumaDpVersion,
} & Record<string, {version: string}>

export interface Entity {
  type: string
  name: string
  creationTime: string
  modificationTime: string
}
export const Entity = {
  fromJSON: (object: any): Entity => {
    return {
      name: object.name || '',
      type: object.type || '',
      creationTime: object.creationTime || '',
      modificationTime: object.modificationTime || '',
    }
  },
}

export type Dataplane = GeneratedDataplane & {
  networking: DataplaneNetworking
  tags: { label: string, value: string }[]
  service: string
  protocol: string
  zone: string
}
export type DataplaneInsight = GeneratedDataplaneInsight & {
  subscriptions: GeneratedDiscoverySubscription[];
}

export type DataplaneOverview = GeneratedDataplaneOverview & Entity & {
  dataplane: Dataplane
  dataplaneInsight: DataplaneInsight
  status: string
  lastUpdated: Date
  version: string
  compatible: boolean,
}
export const DataplaneOverview = {
  fromJSONCollection(collection: CollectionResponse<any>): CollectionResponse<DataplaneOverview> {
    collection.items = collection.items.map((item: any) => {
      return DataplaneOverview.fromJSON(item)
    })
    return collection
  },
  fromJSON(object: any): DataplaneOverview {
    const generated = GeneratedDataplaneOverview.fromJSON(object)
    const item: DataplaneOverview = {
      ...Entity.fromJSON(object),
      ...generated,
      dataplane: Dataplane.fromJSON(generated.dataplane || {}),
      dataplaneInsight: DataplaneInsight.fromJSON(generated.dataplaneInsight || {}),
      status: '',
      lastUpdated: new Date(0),
      version: '',
      compatible: false,
    }

    const dependencies = getDependencies(item.dataplaneInsight)
    item.lastUpdated = getLastUpdated(item.dataplaneInsight)
    // @TODO what does kumaDP.version not being set mean?
    item.version = dependencies.kumaDp?.version ?? ''
    item.compatible = isCompatible(
      dependencies.kumaDp,
      dependencies.envoy,
    )

    item.status = getStatus(item)
    return item
  },
}

export const Dataplane = {
  fromJSONCollection(collection: CollectionResponse<any>): CollectionResponse<Dataplane> {
    collection.items = collection.items.map((item: any) => {
      return Dataplane.fromJSON(item)
    })
    return collection
  },
  fromJSON(object: any): Dataplane {
    const generated = GeneratedDataplane.fromJSON(object)
    const item: Dataplane = {
      ...generated,
      // make sure networking.inbound is at least an empty array
      networking: DataplaneNetworking.fromJSON(generated.networking || {}),
      //
      tags: [],
      service: '',
      protocol: '',
      zone: '',
    }
    item.tags = getTags(item)
    item.service = getTag(item, 'kuma.io/service')
    item.protocol = getTag(item, 'kuma.io/protocol')
    item.zone = getTag(item, 'kuma.io/zone')
    return item
  },
}

export const DataplaneInsight = {
  fromJSON(object: any): DataplaneInsight {
    const generated = GeneratedDataplaneInsight.fromJSON(object || {})
    const item: DataplaneInsight = {
      ...generated,
      // make sure subscriptions is at least an empty array
      subscriptions: Array.isArray(generated.subscriptions) ? generated.subscriptions : [],
      //
    }
    return item
  },
}

// utilities
function getStatus(data: DataplaneOverview): string {
  const dataplane = data.dataplane
  const dataplaneInsight = data.dataplaneInsight
  const errors = dataplane.networking.inbound
    .filter(item => {
      // if item.health is undefined it means that there are no
      // health checks for a proxy i.e. we don't know whether its
      // healthy or not. For now we assume healthy
      return item.health && !item.health.ready
    })
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
        (item: GeneratedDiscoverySubscription) => item.connectTime && !item.disconnectTime,
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

function getVersion(item: DataplaneInsight): GeneratedVersion {
  return item.subscriptions.length === 0 ? GeneratedVersion.fromJSON({}) : GeneratedVersion.fromJSON(item.subscriptions[item.subscriptions.length - 1].version || {})
}

function getDependencies(item: DataplaneInsight): Dependencies {
  const version = getVersion(item)
  const deps: Dependencies = {}
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
    ...insight.subscriptions.reduce((prev: number[], item: GeneratedDiscoverySubscription) => {
      return prev.concat([item.status?.lastUpdateTime?.getTime() ?? 0])
    }, [0]),
  ))
}

function isCompatible(kumaDp: GeneratedKumaDpVersion | undefined, envoy: GeneratedEnvoyVersion | undefined): boolean {
  const isKumaCpCompatible = kumaDp?.kumaCpCompatible ?? true
  if (!isKumaCpCompatible) {
    return false
  }
  const isKumaDpCompatible = envoy?.kumaDpCompatible ?? true
  if (!isKumaDpCompatible) {
    return false
  }
  return true
}
