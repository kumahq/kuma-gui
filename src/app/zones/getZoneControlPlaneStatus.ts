import { StatusKeyword, ZoneOverview } from '@/types/index.d'

export function getZoneControlPlaneStatus(zoneOverview: ZoneOverview): StatusKeyword | 'disabled' {
  if (zoneOverview.zone.enabled === false) {
    return 'disabled'
  }

  const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []
  if (subscriptions.length === 0) {
    return 'offline'
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  return lastSubscription.connectTime?.length && !lastSubscription.disconnectTime ? 'online' : 'offline'
}
