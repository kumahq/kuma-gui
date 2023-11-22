import type { DiscoverySubscription } from '@/types/index.d'

export function getFormattedLastUpdateTime(subscriptions: DiscoverySubscription[]): string | null {
  if (subscriptions.length === 0) {
    return null
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  return lastSubscription.status.lastUpdateTime
}
