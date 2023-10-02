import type { ZoneOverview, StatusKeyword } from '@/types/index.d'
import { get } from '@/utilities/get'

export function getZoneDpServerAuthType(zone: ZoneOverview): string {
  const subscriptions = zone.zoneInsight?.subscriptions ?? []
  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]
    if (lastSubscription.config) {
      const parsedConfig = JSON.parse(lastSubscription.config)
      return get(parsedConfig, 'dpServer.auth.type', 'disabled')
    }
  }
  return 'disabled'
}

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
