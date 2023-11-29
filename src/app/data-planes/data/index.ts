import { getStatus } from '@/app/subscriptions/data'
import type {
  DataPlaneOverview as DataplaneOverview,
  DiscoverySubscription,
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
  const inbounds = dataplaneOverview.dataplane.networking.inbound ?? []
  const errors = inbounds
    .filter((inbound) => inbound.health && !inbound.health.ready)
    .map((inbound) => `Inbound on port ${inbound.port} is not ready (kuma.io/service: ${inbound.tags['kuma.io/service']})`)

  let status: StatusKeyword
  switch (true) {
    case inbounds.length === 0:
      status = 'online'
      break
    // If errors and inbounds are equal (even if they are both 0) then we are offline
    case errors.length === inbounds.length:
      status = 'offline'
      break
    // If there are any errors then we are degraded
    case errors.length > 0:
      status = 'partially_degraded'
      break
    default:
      status = getStatus(dataplaneOverview.dataplaneInsight?.subscriptions)
  }

  return {
    status,
    reason: errors,
  }
}
