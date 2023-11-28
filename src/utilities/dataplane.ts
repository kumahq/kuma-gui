import type { KDSSubscription, StatusKeyword } from '@/types/index.d'

// getItemStatusFromInsight takes object with subscriptions and returns a
// status 'online' | 'offline'
export function getItemStatusFromInsight(insight: { subscriptions?: KDSSubscription[] } | undefined = { subscriptions: [] }): StatusKeyword {
  const proxyOnline = (insight.subscriptions ?? []).some((subscription) => subscription.connectTime?.length && !subscription.disconnectTime)
  return proxyOnline ? 'online' : 'offline'
}
