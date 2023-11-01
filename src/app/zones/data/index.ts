import type { ZoneOverview } from '@/types/index.d'
import { get } from '@/utilities/get'

// TODO(jc): These two are extremely similar, see if we can merge
export function getZoneControlPlaneEnvironment(zoneOverview: ZoneOverview): string {
  // TODO(jc): is it ok to use the config from the first subscription we find here?
  for (const subscription of zoneOverview.zoneInsight?.subscriptions ?? []) {
    if (subscription.config) {
      return JSON.parse(subscription.config).environment
    }
  }
  return ''
}
export function getZoneDpServerAuthType(zone: ZoneOverview): string {
  const subscriptions = zone.zoneInsight?.subscriptions ?? []
  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]
    if (lastSubscription.config) {
      const parsedConfig = JSON.parse(lastSubscription.config)
      return get(parsedConfig, 'dpServer.auth.type', '')
    }
  }
  return ''
}
// TODO(jc): end

export function getZoneControlPlaneStatus(zoneOverview: ZoneOverview): 'online' | 'offline' | 'disabled' {
  if (zoneOverview.zone.enabled === false) {
    return 'disabled'
  }
  return getStatus(zoneOverview.zoneInsight?.subscriptions)
}
export function getStatus(subscriptions: {connectTime?: string, disconnectTime?: string}[] | undefined = []): 'online' | 'offline' {
  const proxyOnline = subscriptions.length > 0 && [subscriptions[subscriptions.length - 1]].every((item) => item.connectTime?.length && !item.disconnectTime)
  return proxyOnline ? 'online' : 'offline'
}
