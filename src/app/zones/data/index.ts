import { get } from '@/app/application'
import { SubscriptionCollection } from '@/app/subscriptions/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneOverview as PartialZoneOverview,
  ZoneInsight as PartialZoneInsight,
  Zone as PartialZone,
  KDSSubscription as PartialKDSSubscription,
} from '@/types/index.d'

export type KDSSubscription = PartialKDSSubscription

type KDSSubscriptionCollection = {
  config: Record<string, unknown>
} & SubscriptionCollection

export const Zone = {
  fromObject: (item: PartialZone) => {
    return {
      ...item,
      enabled: !(item.enabled === false),
    }
  },
}
export type Zone = ReturnType<typeof Zone.fromObject>

const KDSSubscriptionCollection = {
  fromArray: (items?: KDSSubscription[]) => {
    const collection = SubscriptionCollection.fromArray(items)
    // find the first subscription in the list for a config
    // if its valid JSON and is not null, turn it into an object
    const config: Record<string, unknown> = (() => {
      // just find the first that has a config
      const withConfig = collection.subscriptions.find(item => typeof item.config !== 'undefined')
      const str = typeof withConfig?.config !== 'undefined' ? withConfig.config : '{}'
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
  fromObject: (item?: PartialZoneInsight) => {
    const subs = KDSSubscriptionCollection.fromArray(item?.subscriptions)
    return {
      ...item,
      ...subs,
      authenticationType: get(subs.config, 'dpServer.authn.type', ''),
      environment: String(subs.config.environment ?? ''),
      store: get(subs.config, 'store.type', ''),
    }
  },
}
export type ZoneInsight = ReturnType<typeof ZoneInsight.fromObject>

export const ZoneOverview = {
  fromObject: (item: PartialZoneOverview) => {
    const insight = ZoneInsight.fromObject(item.zoneInsight)
    const zone = Zone.fromObject(item.zone)
    const warnings = []
    if (insight.store === 'memory') {
      warnings.push({
        kind: 'ZONE_STORE_TYPE_MEMORY',
        payload: {},
      })
    }
    if (!get(insight, 'version.kumaCp.kumaCpGlobalCompatible', true)) {
      warnings.push({
        kind: 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS',
        payload: {
          zoneCpVersion: get(insight, 'version.kumaCp.version', '-'),
        },
      })
    }
    const state = {
      disabled: 'disabled',
      online: 'online',
      offline: 'offline',
    } as const
    return {
      ...item,
      zoneInsight: insight,
      zone,
      // first check see if the zone is disabled, if not look for the connectedSubscription
      state: !zone.enabled ? state.disabled : typeof insight.connectedSubscription !== 'undefined' ? state.online : state.offline,
      warnings,
    }
  },
  fromCollection: (collection: CollectionResponse<PartialZoneOverview>) => {
    const items = Array.isArray(collection.items) ? collection.items.map(ZoneOverview.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type ZoneOverview = ReturnType<typeof ZoneOverview.fromObject>
