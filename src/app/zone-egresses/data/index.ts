import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneEgressOverview as PartialZoneEgressOverview,
  ZoneEgress as PartialZoneEgress,
  KDSSubscription,
} from '@/types/index.d'

type PartialZoneEgressInsight = any
type PartialInternalZoneEgress = PartialZoneEgressOverview['zoneEgress']

// TODO(jc) Theres probably a better way to not copy/pasta this i.e. make `Entity` composable
type InternalZoneEgress = {
  socketAddress: string
} & PartialInternalZoneEgress

export type ZoneEgress = {
  config: PartialZoneEgress
  socketAddress: string
} & PartialZoneEgress
// end TODO

// TODO(jc) currently in our manually written types ZoneEgressInsight is any therefore
// we have no Partial*
export type ZoneEgressInsight = {
  connectedSubscription?: KDSSubscription
  subscriptions: KDSSubscription[]
}
export type ZoneEgressOverview = PartialZoneEgressOverview & {
  zoneEgress: InternalZoneEgress
  zoneEgressInsight?: ZoneEgressInsight
  state: 'online' | 'offline'
}
// TODO(jc) Theres probably a better way to not copy/pasta this i.e. make `Entity` composable
const InternalZoneEgress = {
  fromObject: (item: PartialInternalZoneEgress): InternalZoneEgress => {
    return {
      ...item,
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
    }
  },
}

export const ZoneEgress = {
  fromObject: (item: PartialZoneEgress): ZoneEgress => {
    return {
      ...item,
      config: item,
      socketAddress: item.networking?.address && item.networking?.port ? `${item.networking.address}:${item.networking.port}` : '',
    }
  },
}
// end TODO
export const ZoneEgressInsight = {
  fromObject: (item?: PartialZoneEgressInsight): ZoneEgressInsight | undefined => {
    // if item isn't set don't even try augmenting things
    return isSet<PartialZoneEgressInsight>(item)
      ? ((item) => {
        const subscriptions: KDSSubscription[] = Array.isArray(item.subscriptions) ? item.subscriptions : []
        // figure out the connectedSubscription by looking at the connectTime
        // and disconnectTime of the last subscription
        const connectedSubscription = subscriptions.slice(-1).find((item) => item.connectTime?.length && !item.disconnectTime)
        return {
          ...item,
          subscriptions,
          connectedSubscription,
        }
      })(item)
      : undefined
  },
}
export const ZoneEgressOverview = {
  fromObject: (item: PartialZoneEgressOverview): ZoneEgressOverview => {
    const insight = ZoneEgressInsight.fromObject(item.zoneEgressInsight)
    const zoneEgress = InternalZoneEgress.fromObject(item.zoneEgress)
    return {
      ...item,
      zoneEgressInsight: insight,
      zoneEgress,
      // it is possible to have zoneEgresses on a 'disabled' zone but we don't
      // want to do anything special about that just now at least
      state: typeof insight?.connectedSubscription !== 'undefined' ? 'online' : 'offline',
    }
  },
  fromCollection: (collection: CollectionResponse<PartialZoneEgressOverview>): CollectionResponse<ZoneEgressOverview> => {
    return {
      ...collection,
      items: Array.isArray(collection.items) ? collection.items.map(ZoneEgressOverview.fromObject) : [],
    }
  },
}
function isSet<T>(value: T | null | undefined): value is T {
  return value !== null && typeof value !== 'undefined'
}
