import type { components } from '@kumahq/kuma-http-api'

type KumaDataPlaneInsightSubscriptionCollection = components['schemas']['DataplaneInsightItem']['subscriptions']
type KumaDataPlaneInsightSubscription = NonNullable<KumaDataPlaneInsightSubscriptionCollection>[number]

type KumaZoneInsightSubscriptionCollection = components['schemas']['ZoneInsightItem']['subscriptions']
type KumaZoneInsightSubscription = NonNullable<KumaZoneInsightSubscriptionCollection>[number]

type KumaSubscriptionCollection = KumaDataPlaneInsightSubscriptionCollection | KumaZoneInsightSubscriptionCollection
type KumaSubscription = NonNullable<KumaSubscriptionCollection>[number]

type Acknowledgements = Required<NonNullable<NonNullable<KumaDataPlaneInsightSubscription['status']>['total']>> | Required<NonNullable<NonNullable<KumaZoneInsightSubscription['status']>['total']>>

const acknowledgements = [
  'responsesSent',
  'responsesAcknowledged',
  'responsesRejected',
] as const satisfies Array<keyof Acknowledgements>

export const Subscription = {
  fromObject<T extends KumaSubscription>(item: T) {
    return {
      $raw: item,
      ...item,
      status: (<S extends KumaSubscription['status']>(status: S) => {
        const generic = status as NonNullable<KumaSubscription['status']>
        const { total = {}, lastUpdateTime, stat = {}, ...rest } = { stat: {}, ...generic }
        const stats: Record<string, Record<string, number>> = Object.keys(stat).length > 0 ? stat : rest
        return {
          ...status,
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
        }
      })(item.status),
      ...(() => {
        // depending on wether we have a `zoneInstanceId` or `controlPlaneInstanceId` we deal with `ZoneInsight` or `DataplaneInsight`
        switch (true) {
          case 'zoneInstanceId' in item:
            return {
              zoneInstanceId: item.zoneInstanceId,
              globalInstanceId: item.globalInstanceId,
              controlPlaneInstanceId: undefined,
              instance: {
                id: item.zoneInstanceId ?? '',
                version: item.version?.kumaCp?.version ?? '',
              },
            }
          case 'controlPlaneInstanceId' in item:
            return {
              zoneInstanceId: undefined,
              globalInstanceId: undefined,
              controlPlaneInstanceId: item.controlPlaneInstanceId,
              instance: {
                id: item.controlPlaneInstanceId ?? '',
                version: item.version?.kumaDp?.version ?? '',
              },
            }
          default:
            return {
              zoneInstanceId: undefined,
              globalInstanceId: undefined,
              controlPlaneInstanceId: undefined,
              instance: {
                id: '',
                version: '',
              },
            }
        }
      })(),
    }
  },
}

export const DiscoverySubscriptionCollection = {
  fromArray: <T extends KumaSubscriptionCollection>(items?: T) => {
    return SubscriptionCollection.fromArray(items)
  },
}

export const SubscriptionCollection = {
  fromArray: <T extends KumaSubscriptionCollection>(items?: T) => {
    const subscriptions = (items ?? []).map((item) => Subscription.fromObject<NonNullable<T>[number]>(item))

    // sort the array by lastUpdateTime so we end up with the latest one in the
    // case that there are multiple of anything
    const subs = subscriptions.toSorted((a, b) => b.status.lastUpdateTime && a.status.lastUpdateTime ? Date.parse(b.status.lastUpdateTime) - Date.parse(a.status.lastUpdateTime) : 1)

    // find a version
    const version: ReturnType<typeof Subscription.fromObject<NonNullable<T>[number]>>['version'] = subs.find((item) => item.version !== undefined)?.version

    // figure out the connectedSubscription by looking for any subscriptions
    // without a disconnectTime
    const connected = subs.find((item) => !item.disconnectTime)

    return {
      subscriptions,
      connectedSubscription: connected,
      version,
    }
  },
}
export type SubscriptionCollection = ReturnType<typeof SubscriptionCollection.fromArray<KumaSubscriptionCollection>>
export type DiscoverySubscriptionCollection = ReturnType<typeof DiscoverySubscriptionCollection.fromArray<KumaSubscriptionCollection>>
export type Subscription = ReturnType<typeof Subscription.fromObject<KumaSubscription>>
export type Version = NonNullable<ReturnType<typeof Subscription.fromObject<KumaSubscription>>['version']>
