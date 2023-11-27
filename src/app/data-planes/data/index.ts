import { getIsConnected } from '@/app/subscriptions/data'
import type {
  DataPlaneOverview as DataplaneOverview,
  DiscoverySubscription,
  LabelValue,
  StatusKeyword,
} from '@/types/index.d'

export function getLastUpdateTime(subscriptions: DiscoverySubscription[]): string | undefined {
  if (subscriptions.length === 0) {
    return undefined
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  return lastSubscription.status.lastUpdateTime
}

export function getStatusAndReason(dataplaneOverview: DataplaneOverview): { status: StatusKeyword, reason: string[] } {
  const isConnected = getIsConnected(dataplaneOverview.dataplaneInsight?.subscriptions)
  // For gateways, the only relevant status criteria are subscriptions.
  if (dataplaneOverview.dataplane.networking.gateway) {
    return {
      status: isConnected ? 'online' : 'offline',
      reason: [],
    }
  }

  const inbounds = dataplaneOverview.dataplane.networking.inbound ?? []
  const unhealthyInbounds = inbounds
    .filter((inbound) => inbound.health && !inbound.health.ready)
    .map((inbound) => `Inbound on port ${inbound.port} is not ready (kuma.io/service: ${inbound.tags['kuma.io/service']})`)

  let status: StatusKeyword
  switch (true) {
    case inbounds.length === 0:
      status = 'online'
      break
    case unhealthyInbounds.length === inbounds.length:
      // All inbounds being unhealthy means the Dataplane is offline.
      status = 'offline'
      break
    case unhealthyInbounds.length > 0:
      // Some inbounds being unhealthy means the Dataplane is partially degraded.
      status = 'partially_degraded'
      break
    default:
      // All inbounds being healthy means the Dataplane’s status is determined by whether it’s connected to a control plane.
      status = isConnected ? 'online' : 'offline'
  }

  return {
    status,
    reason: unhealthyInbounds,
  }
}

export function getTags(dataplaneOverview: DataplaneOverview): LabelValue[] {
  let tags: string[] = []
  const separator = '='
  const { gateway, inbound } = dataplaneOverview.dataplane.networking

  if (inbound) {
    tags = inbound
      .flatMap((inbound) => Object.entries(inbound.tags))
      .map(([key, value]) => key + separator + value)
  }

  if (gateway) {
    tags = Object.entries(gateway.tags).map(([key, value]) => key + separator + value)
  }

  const uniqueTags = Array.from(new Set(tags))

  uniqueTags.sort((tagPairA, tagPairB) => tagPairA.localeCompare(tagPairB))

  return uniqueTags.map((tagPair) => {
    const [label, value] = tagPair.split(separator)
    return { label, value }
  })
}
