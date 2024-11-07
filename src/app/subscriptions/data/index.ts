import type {
  Version as PartialVersion,
  DiscoverySubscription as PartialDiscoverySubscription,
  SubscriptionStatus as PartialSubscriptionStatus,
  Subscription as ProtoSubscription,
} from '@/types/index.d'

const acknowledgements = [
  'responsesSent',
  'responsesAcknowledged',
  'responsesRejected',
] as const
type Acknowledgements = {
  [key in (typeof acknowledgements)[number]]: number
}

export type Version = PartialVersion

export type PartialSubscription = {
  status: PartialSubscriptionStatus
  version?: Version
} & ProtoSubscription

export type DiscoverySubscription = PartialDiscoverySubscription

export const Subscription = {
  fromObject<T extends PartialSubscription>(item: T) {
    return {
      $raw: item,
      ...item,
      status: ((item) => {
        const { total = {}, lastUpdateTime, stat = {}, ...rest } = { stat: {}, ...item }
        const stats: Record<string, Record<string, number>> = Object.keys(stat).length > 0 ? stat : rest
        return {
          ...item,
          // make sure we default to zero for all acknowledgement properties
          total: {
            ...total,
            ...acknowledgements.reduce((prev, prop) => {
              prev[prop] = total[prop] ?? 0
              return prev
            }, {} as Acknowledgements),
          },
          acknowledgements: {
            ...Object.fromEntries(
              Object.entries(stats).map(([key, value]) => {
                return [key, acknowledgements.reduce((prev, prop) => {
                  prev[prop] = value[prop] ?? 0
                  return prev
                }, {} as Acknowledgements)]
              }),
            ),
          },
          //
        }
      })(item.status),
    }
  },
}
export type Subscription = ReturnType<typeof Subscription.fromObject> & {
  zoneInstanceId?: string
  globalInstanceId?: string
  controlPlaneInstanceId?: string
}
export const DiscoverySubscriptionCollection = {
  fromArray: (items?: DiscoverySubscription[]) => {
    return SubscriptionCollection.fromArray(items)
  },
}
export type DiscoverySubscriptionCollection = ReturnType<typeof DiscoverySubscriptionCollection.fromArray>
export const SubscriptionCollection = {
  fromArray: <T extends PartialSubscription>(items?: T[]) => {
    const subscriptions = Array.isArray(items) ? items.map(Subscription.fromObject<T>) : []

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
export type SubscriptionCollection = ReturnType<typeof SubscriptionCollection.fromArray>
