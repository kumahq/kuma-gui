import { DISABLED } from '@/constants'
import { ZoneOverview } from '@/types/index.d'
import { get } from '@/utilities/get'

export function getZoneDpServerAuthType(zone: ZoneOverview): string {
  const subscriptions = zone.zoneInsight?.subscriptions ?? []

  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]

    if (lastSubscription.config) {
      const parsedConfig = JSON.parse(lastSubscription.config)

      return get(parsedConfig, 'dpServer.auth.type', DISABLED)
    }
  }

  return DISABLED
}
