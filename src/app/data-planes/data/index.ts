import type { DiscoverySubscription } from '@/types/index.d'

export function getFormattedLastUpdateTime(subscriptions: DiscoverySubscription[]): string | undefined {
  if (subscriptions.length === 0) {
    return undefined
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  return lastSubscription.status.lastUpdateTime
}
