import type {
  Version as PartialVersion,
} from '@/types/index.d'

export function getIsConnected(subscriptions: { connectTime?: string, disconnectTime?: string }[] | undefined = []): boolean {
  return subscriptions.length > 0 && [subscriptions[subscriptions.length - 1]].every((item) => item.connectTime?.length && !item.disconnectTime)
}

const lastUpdateTimeDesc = <T extends { status: { lastUpdateTime: string } }>(a: T, b: T): number => {
  const y = Date.parse(a.status.lastUpdateTime)
  const z = Date.parse(b.status.lastUpdateTime)
  switch (true) {
    case y > z:
      return -1
    case z > y:
      return 1
  }
  return 0
}
export type Version = PartialVersion
export type Subscription = {
  disconnectTime?: string
  status: {
    lastUpdateTime: string
  }
  version?: Version
}
export type SubscriptionCollection<T extends { version?: any }> = {
  subscriptions: T[]
  connectedSubscription?: T
  latestSubscription?: T
  version?: T['version']
}
export const SubscriptionCollection = {
  fromArray: <T extends Subscription>(items?: T[]): SubscriptionCollection<T> => {
    const subscriptions = Array.isArray(items) ? items : []
    const withVersion = subscriptions.find(item => typeof item.version !== 'undefined')
    // figure out the connectedSubscription by looking for any subscriptions
    // without a disconnectTime sort the result to put the latest one first,
    // then use the first, which could be undefined
    const connected = subscriptions.filter((item) => !item.disconnectTime).sort(lastUpdateTimeDesc)[0]
    // figure out the latestSubscription by sorting with the latest one first
    // then use the first, which could be undefined
    // additionally we should use this one to look for warnings
    const latest = subscriptions.slice().sort(lastUpdateTimeDesc)[0]
    return {
      subscriptions,
      connectedSubscription: connected,
      latestSubscription: latest,
      version: withVersion?.version,
    }
  },
}
