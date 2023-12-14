import type {
  Version as PartialVersion,
} from '@/types/index.d'

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
  version?: T['version']
}
export const SubscriptionCollection = {
  fromArray: <T extends Subscription>(items?: T[]): SubscriptionCollection<T> => {
    const subscriptions = Array.isArray(items) ? items : []
    // figure out the version by looking for any subscriptions
    // with a version and sort the result to put the latest one first in
    // case there are multiple, then use the first, which could be undefined
    const withVersion = subscriptions.filter(item => typeof item.version !== 'undefined').sort(lastUpdateTimeDesc)[0]
    // figure out the connectedSubscription by looking for any subscriptions
    // without a disconnectTime and sort the result to put the latest one first
    // in case there are multiple, then use the first, which could be undefined
    const connected = subscriptions.filter((item) => !item.disconnectTime).sort(lastUpdateTimeDesc)[0]
    return {
      subscriptions,
      connectedSubscription: connected,
      version: withVersion?.version,
    }
  },
}
