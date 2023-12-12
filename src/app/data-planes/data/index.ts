import { getIsConnected } from '@/app/subscriptions/data'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  DataPlane as PartialDataplane,
  DataPlaneInsight as PartialDataplaneInsight,
  DataplaneNetworking as PartialDataplaneNetworking,
  DataPlaneOverview as PartialDataplaneOverview,
  DiscoverySubscription,
  LabelValue,
  DataplaneInbound as PartialDataplaneInbound,
  DataplaneOutbound as PartialDataplaneOutbound,
} from '@/types/index.d'

export type DataplaneWarning = {
  kind: string
  payload?: {
    kumaDp: string
    envoy?: string
  }
}

export type DataplaneInbound = PartialDataplaneInbound & {
  health: {
    ready: boolean
  }
  addressPort: string
  serviceAddressPort: string
}

export type DataplaneOutbound = PartialDataplaneOutbound

export type DataplaneNetworking = Omit<PartialDataplaneNetworking, 'inbound' | 'outbound'> & {
  inbounds: DataplaneInbound[]
  outbounds: DataplaneOutbound[]
}

export type Dataplane = PartialDataplane & {
  networking: DataplaneNetworking
}

export type DataplaneInsight = PartialDataplaneInsight & {
  subscriptions: DiscoverySubscription[]
  connectedSubscription?: DiscoverySubscription
}

export type DataplaneOverview = PartialDataplaneOverview & {
  dataplane: {
    networking: DataplaneNetworking
  }
  dataplaneInsight: DataplaneInsight
  dataplaneType: 'standard' | 'builtin' | 'delegated'
  status: 'online' | 'offline' | 'partially_degraded'
  unhealthyInbounds: Array<{ service: string, port: number }>
  lastUpdateTime?: string | undefined
  warnings: DataplaneWarning[]
  isCertExpired: boolean
  services: string[]
}

const DataplaneNetworking = {
  fromObject(partialDataplaneNetworking: PartialDataplaneNetworking): DataplaneNetworking {
    const { inbound, outbound, ...rest } = partialDataplaneNetworking

    const inbounds: DataplaneInbound[] = (inbound ?? []).map((inbound) => {
      // An inbound without a health property is considered healthy.
      const health = { ready: !inbound.health || inbound.health.ready }
      const addressPort = `${inbound.address ?? partialDataplaneNetworking.advertisedAddress ?? partialDataplaneNetworking.address}:${inbound.port}`
      const serviceAddressPort = `${inbound.serviceAddress ?? inbound.address ?? partialDataplaneNetworking.address}:${inbound.servicePort ?? inbound.port}`

      return {
        ...inbound,
        health,
        addressPort,
        serviceAddressPort,
      }
    })

    const outbounds: DataplaneOutbound[] = outbound ?? []

    return {
      ...rest,
      inbounds,
      outbounds,
    }
  },
}

export const Dataplane = {
  fromObject(partialDataplane: PartialDataplane): Dataplane {
    return {
      ...partialDataplane,
      networking: DataplaneNetworking.fromObject(partialDataplane.networking),
    }
  },
}

const DataplaneInsight = {
  fromObject(partialDataplaneInsight: PartialDataplaneInsight | undefined): DataplaneInsight {
    const subscriptions = Array.isArray(partialDataplaneInsight?.subscriptions) ? partialDataplaneInsight.subscriptions : []
    const connectedSubscription = subscriptions.find((subscription) => !subscription.disconnectTime)

    return {
      ...partialDataplaneInsight,
      connectedSubscription,
      subscriptions,
    }
  },
}

export const DataplaneOverview = {
  fromObject(partialDataplaneOverview: PartialDataplaneOverview, canUseZones: boolean): DataplaneOverview {
    const dataplaneInsight = DataplaneInsight.fromObject(partialDataplaneOverview.dataplaneInsight)
    const networking = DataplaneNetworking.fromObject(partialDataplaneOverview.dataplane.networking)

    const dataplaneType = getDataplaneType(networking)
    const status = getStatus(partialDataplaneOverview)
    const unhealthyInbounds = getUnhealthyInbounds(networking)
    const lastUpdateTime = dataplaneInsight.subscriptions.at(-1)?.status.lastUpdateTime
    const tags = getTags(networking)
    const services = tags.filter((tag) => tag.label === 'kuma.io/service').map(({ value }) => value)
    const warnings = getWarnings(dataplaneInsight, tags, canUseZones)
    const isCertExpired = getIsCertExpired(dataplaneInsight)

    return {
      ...partialDataplaneOverview,
      dataplane: {
        networking,
      },
      dataplaneInsight,
      dataplaneType,
      status,
      unhealthyInbounds,
      lastUpdateTime,
      warnings,
      isCertExpired,
      services,
    }
  },

  fromCollection(partialDataplaneOverviews: PaginatedApiListResponse<PartialDataplaneOverview>, canUseZones: boolean): PaginatedApiListResponse<DataplaneOverview> {
    return {
      ...partialDataplaneOverviews,
      items: Array.isArray(partialDataplaneOverviews.items)
        ? partialDataplaneOverviews.items.map((partialDataplaneOverview) => DataplaneOverview.fromObject(partialDataplaneOverview, canUseZones))
        : [],
    }
  },
}

// TODO: Update the implementation once OnboardingDataplanesView no longer uses this function and remove the export.
export function getStatus(dataplaneOverview: PartialDataplaneOverview): 'online' | 'offline' | 'partially_degraded' {
  const isConnected = getIsConnected(dataplaneOverview.dataplaneInsight?.subscriptions)
  // For gateways, the only relevant status criteria are subscriptions.
  if (dataplaneOverview.dataplane.networking.gateway) {
    return isConnected ? 'online' : 'offline'
  }

  // TODO: Update this to use the transformed inbounds property instead and check for `!inbound.isHealthy`.
  const inbounds = dataplaneOverview.dataplane.networking.inbound ?? []
  const unhealthyInbounds = inbounds.filter((inbound) => inbound.health && !inbound.health.ready)

  switch (true) {
    case unhealthyInbounds.length === inbounds.length:
      // All inbounds being unhealthy means the Dataplane is offline.
      return 'offline'
    case unhealthyInbounds.length > 0:
      // Some inbounds being unhealthy means the Dataplane is partially degraded.
      return 'partially_degraded'
    default:
      // All inbounds being healthy means the Dataplane’s status is determined by whether it’s connected to a control plane.
      return isConnected ? 'online' : 'offline'
  }
}

function getUnhealthyInbounds({ inbounds }: DataplaneNetworking): Array<{ service: string, port: number }> {
  return inbounds
    .filter((inbound) => !inbound.health.ready)
    .map(({ tags, port }) => ({ service: tags['kuma.io/service'], port }))
}

function getTags({ gateway, inbounds }: DataplaneNetworking): LabelValue[] {
  let tags: string[] = []
  const separator = '='

  if (inbounds.length > 0) {
    tags = inbounds
      .flatMap((inbound) => Object.entries(inbound.tags))
      .map(([key, value]) => `${key}${separator}${value}`)
  }

  if (gateway) {
    tags = Object.entries(gateway.tags).map(([key, value]) => `${key}${separator}${value}`)
  }

  const uniqueTags = Array.from(new Set(tags))

  uniqueTags.sort((tagPairA, tagPairB) => tagPairA.localeCompare(tagPairB))

  return uniqueTags.map((tagPair) => {
    const [label, value] = tagPair.split(separator)
    return { label, value }
  })
}

function getIsCertExpired({ mTLS }: DataplaneInsight): boolean {
  return mTLS ? Date.now() > new Date(mTLS.certificateExpirationTime).getTime() : false
}

function getWarnings({ subscriptions }: DataplaneInsight, tags: LabelValue[], canUseZones: boolean): DataplaneWarning[] {
  const lastSubscription = subscriptions.at(-1)
  if (!lastSubscription || !lastSubscription.version) {
    return []
  }

  const warnings: DataplaneWarning[] = []
  const version = lastSubscription.version
  if (version.kumaDp && version.envoy) {
    const isKumaCpCompatible = version.kumaDp?.kumaCpCompatible ?? true
    if (!isKumaCpCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_UNSUPPORTED_KUMA_DP',
        payload: {
          kumaDp: version.kumaDp.version,
        },
      })
    }

    const isKumaDpCompatible = version.envoy?.kumaDpCompatible ?? true
    if (!isKumaDpCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_UNSUPPORTED_ENVOY',
        payload: {
          envoy: version.envoy.version,
          kumaDp: version.kumaDp.version,
        },
      })
    }
  }

  if (canUseZones) {
    const zoneTag = tags.find(tag => tag.label === 'kuma.io/zone')

    if (zoneTag && typeof version.kumaDp.kumaCpCompatible === 'boolean' && !version.kumaDp.kumaCpCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS',
        payload: {
          kumaDp: version.kumaDp.version,
        },
      })
    }
  }

  return warnings
}

function getDataplaneType({ gateway }: DataplaneNetworking): 'standard' | 'builtin' | 'delegated' {
  if (gateway) {
    if (gateway.type) {
      return gateway.type.toLowerCase() as 'builtin' | 'delegated'
    } else {
      // Dataplanes with a gateway property but without a type are delegated gateways.
      return 'delegated'
    }
  }

  return 'standard'
}
