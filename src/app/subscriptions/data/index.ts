import type {
  Version as PartialVersion,
  DiscoverySubscription as PartialDiscoverySubscription,
} from '@/types/index.d'

export type Version = PartialVersion
export type Subscription = {
  disconnectTime?: string
  status: {
    lastUpdateTime: string
  }
  version?: Version
}
export type DiscoverySubscription = PartialDiscoverySubscription
export type SubscriptionCollection<T extends { version?: any }> = {
  subscriptions: T[]
  connectedSubscription?: T
  version?: T['version']
}
export type DiscoverySubscriptionCollection = SubscriptionCollection<DiscoverySubscription>

export const DiscoverySubscriptionCollection = {
  fromArray: (items?: DiscoverySubscription[]): DiscoverySubscriptionCollection => {
    return SubscriptionCollection.fromArray(items)
  },
}
export const SubscriptionCollection = {
  fromArray: <T extends Subscription>(items?: T[]): SubscriptionCollection<T> => {
    const subscriptions = Array.isArray(items) ? items : []

    // make a copy of the original array so we don't change its order
    const subs = subscriptions.slice()

    // sort the array by lastUpdateTime so we end up with the latest one in the
    // case that there are multiple of anything
    subs.sort((a, b) => Date.parse(b.status.lastUpdateTime) - Date.parse(a.status.lastUpdateTime))

    // find a version
    const withVersion = subs.find((item) => typeof item.version !== 'undefined')

    // figure out the connectedSubscription by looking for any subscriptions
    // without a disconnectTime
    const connected = subs.find((item) => !item.disconnectTime)

    return {
      subscriptions,
      connectedSubscription: connected,
      version: withVersion?.version,
    }
  },
}
