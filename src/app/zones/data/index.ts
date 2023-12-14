import { SubscriptionCollection } from '@/app/subscriptions/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneOverview as PartialZoneOverview,
  ZoneInsight as PartialZoneInsight,
  Zone as PartialZone,
  KDSSubscription,
} from '@/types/index.d'
import { get } from '@/utilities/get'

type KDSSubscriptionCollection = {
  config: Record<string, unknown>
} & SubscriptionCollection<KDSSubscription>

export type Zone = PartialZone & {
  enabled: boolean
}

export type ZoneInsight = {
  authenticationType: string
  environment: string
  store: string
} & KDSSubscriptionCollection & PartialZoneInsight

export type ZoneOverview = PartialZoneOverview & {
  zoneInsight: ZoneInsight
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

const KDSSubscriptionCollection = {
  fromArray: (items?: KDSSubscription[]): KDSSubscriptionCollection => {
    const collection = SubscriptionCollection.fromArray(items)
    // find the first subscription in the list for a config
    // if its valid JSON and is not null, turn it into an object
    const config: Record<string, unknown> = (() => {
      // just find the first that has a config
      const withConfig = collection.subscriptions.find(item => typeof item.config !== 'undefined')
      const str = isSet<string>(withConfig?.config) ? withConfig.config : '{}'
      try {
        return JSON.parse(str)
      } catch (e) {
        console.error(e)
      }
      return {}
    })()
    return {
      ...collection,
      config,
    }
  },
}

export const ZoneInsight = {
  fromObject: (item?: PartialZoneInsight): ZoneInsight => {
    const subs = KDSSubscriptionCollection.fromArray(item?.subscriptions)
    return {
      ...item,
      ...subs,
      authenticationType: get(subs.config, 'dpServer.auth.type', ''),
      environment: String(subs.config.environment ?? ''),
      store: get(subs.config, 'store.type', ''),
    }
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
      // first check see if the zone is disabled, if not look for the connectedSubscription
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
