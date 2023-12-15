import type {
  Version as PartialVersion,
} from '@/types/index.d'

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
    // make a copy of the subscriptions and then sort with the latest one first
    // so we don't change the order of the original array, plus any finding we
    // do will always gives us the latest subscription if there are multiple
    const subs = subscriptions.slice()
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
