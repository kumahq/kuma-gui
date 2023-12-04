import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneOverview as PartialZoneOverview,
  ZoneInsight as PartialZoneInsight,
  Zone as PartialZone,
  KDSSubscription,
} from '@/types/index.d'
import { get } from '@/utilities/get'

export type Zone = PartialZone & {
  enabled: boolean
}
export type ZoneInsight = PartialZoneInsight & {
  connectedSubscription?: KDSSubscription
  config: Record<string, unknown>
  authenticationType: string
  environment: string
} & Required<Pick<PartialZoneInsight, 'subscriptions'>> & PartialZoneInsight

export type ZoneOverview = PartialZoneOverview & {
  zoneInsight?: ZoneInsight
  zone: Zone
  state: 'online' | 'offline' | 'disabled'
}

export const Zone = {
  fromObject: (item: PartialZone): Zone => {
    return {
      ...item,
      enabled: !(item.enabled === false),
    }
  },
}

export const ZoneInsight = {
  fromObject: (item?: PartialZoneInsight): ZoneInsight | undefined => {
    // if item isn't set don't even try augmenting things
    return isSet<PartialZoneInsight>(item)
      ? ((item) => {
        item.subscriptions = !Array.isArray(item.subscriptions) ? [] : item.subscriptions
        // figure out the connectedSubscription by looking at the connectTime
        // and disconnectTime of the last subscription
        const connectedSubscription = item.subscriptions.slice(-1).find((item) => item.connectTime?.length && !item.disconnectTime)
        // using the connectedSubscription find the config for the zone if it exists, is valid JSON and is not null and
        // turn it into an object
        const config: Record<string, unknown> = (() => {
          const str = isSet<string>(connectedSubscription?.config) ? connectedSubscription.config : '{}'
          try {
            return JSON.parse(str)
          } catch (e) {
            console.error(e)
          }
          return {}
        })()

        // set the extra stuff
        return {
          ...item,
          connectedSubscription,
          config,
          authenticationType: get(config, 'dpServer.auth.type', ''),
          environment: String(config.environment ?? ''),
        }
      })(item)
      : undefined
  },
}
export const ZoneOverview = {
  fromObject: (item: PartialZoneOverview): ZoneOverview => {
    const insight = ZoneInsight.fromObject(item.zoneInsight)
    const zone = Zone.fromObject(item.zone)
    return {
      ...item,
      zoneInsight: insight,
      zone,
      // first check see if the zone is disabled, if not look for the connectSubscription
      state: !zone.enabled ? 'disabled' : typeof insight?.connectedSubscription !== 'undefined' ? 'online' : 'offline',
    }
  },
  fromCollection: (collection: CollectionResponse<PartialZoneOverview>): CollectionResponse<ZoneOverview> => {
    return {
      ...collection,
      items: Array.isArray(collection.items) ? collection.items.map(ZoneOverview.fromObject) : [],
    }
  },
}
function isSet<T>(value: T | null | undefined): value is T {
  return value !== null && typeof value !== 'undefined'
}
