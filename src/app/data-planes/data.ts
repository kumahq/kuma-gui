import type { DiscoverySubscription } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { formatIsoDate } = useI18n()

export function getFormattedLastUpdateTime(subscriptions: DiscoverySubscription[]): string | null {
  if (subscriptions.length === 0) {
    return null
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  return formatIsoDate(lastSubscription.status.lastUpdateTime)
}
