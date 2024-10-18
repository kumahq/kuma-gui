import { DataplaneInsight } from './DataplaneInsight'
import { DataplaneNetworking } from './DataplaneNetworking'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  DataPlaneOverview as PartialDataplaneOverview,
  DataplaneWarning,
  LabelValue,
} from '@/types/index.d'
export type DataplaneOverview = PartialDataplaneOverview & {
  dataplane: {
    networking: DataplaneNetworking
  }
  id: string
  namespace: string
  labels: Exclude<PartialDataplaneOverview['labels'], undefined>
  dataplaneInsight: DataplaneInsight
  dataplaneType: 'standard' | 'builtin' | 'delegated'
  status: 'online' | 'offline' | 'partially_degraded'
  warnings: DataplaneWarning[]
  isCertExpired: boolean
  zone: string | undefined
  services: string[]
}

// any collection of non-spaces followed by a `:` or `: ` followed by a
// collection of non-spaces
// or
// a collection of non-spaces
//
// Should match:
// `kuma.io/service: name`
// `kuma.io/service:name`
// `version:1`
// `dpp-name`
const searchRe = /(\S+:\s*\S*)|(\S*)/g

const searchShortcuts: Record<string, string> = {
  service: 'kuma.io/service',
  zone: 'kuma.io/zone',
  protocol: 'kuma.io/protocol',
}
export const DataplaneOverview = {
  search(search: string) {
    const terms = [...search.matchAll(searchRe)].filter(item => item[0].length > 0).map(item => item[0].trim())
    return terms.reduce<{
      tag: string[]
      name?: string
    }>((prev, item) => {
      return (function parse(prev, item, tag = false) {
        const [key, ...value] = item.split(':')
        if (key === 'name') {
          prev.name = value.join(':').trim()
        } else if (!tag && value.length === 0) {
          prev.name = key.trim()
        } else if (key === 'tag') {
          return parse(prev, value.join(':').trim(), true)
        } else {
          prev.tag.push(`${searchShortcuts[key] || key}${value.length > 0 ? ':' : ''}${value.join(':').trim()}`)
        }
        return prev
      })(prev, item)
    }, { tag: [] }) || {}
  },
  fromObject(item: PartialDataplaneOverview, canUseZones: boolean): DataplaneOverview {
    const dataplaneInsight = DataplaneInsight.fromObject(item.dataplaneInsight)

    const networking = DataplaneNetworking.fromObject(item.dataplane.networking)

    const tags = getTags(networking)
    const warnings = getWarnings(dataplaneInsight, tags, canUseZones)
    const isCertExpired = getIsCertExpired(dataplaneInsight)
    const services = tags.filter((tag) => tag.label === 'kuma.io/service').map(({ value }) => value)
    const zone = tags.find((tag) => tag.label === 'kuma.io/zone')?.value
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}

    return {
      ...item,
      id: item.name,
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      dataplane: {
        networking,
      },
      labels,
      dataplaneInsight,
      dataplaneType: networking.type === 'gateway' ? 'builtin' : typeof networking.gateway !== 'undefined' ? 'delegated' : 'standard',
      status: (() => {
        const state = typeof dataplaneInsight.connectedSubscription !== 'undefined' ? 'online' : 'offline'
        if (networking.gateway) {
          return state
        }

        const unhealthyInbounds = networking.inbounds.filter((inbound) => inbound.state !== 'Ready')
        switch (true) {
          case unhealthyInbounds.length === networking.inbounds.length:
            // All inbounds being unhealthy means the Dataplane is offline.
            return 'offline'
          case unhealthyInbounds.length > 0:
            // Some inbounds being unhealthy means the Dataplane is partially degraded.
            return 'partially_degraded'
          default:
            // All inbounds being healthy means the Dataplane’s status is determined by whether it’s connected to a control plane.
            return state
        }
      })(),
      warnings,
      isCertExpired,
      services,
      zone,
    }
  },

  fromCollection(partialDataplaneOverviews: PaginatedApiListResponse<PartialDataplaneOverview>, canUseZones: boolean): PaginatedApiListResponse<DataplaneOverview> {
    return {
      ...partialDataplaneOverviews,
      items: Array.isArray(partialDataplaneOverviews.items)
        ? partialDataplaneOverviews.items.map((partialDataplaneOverview) => DataplaneOverview.fromObject(partialDataplaneOverview, canUseZones))
        : [],
    }
  },
}
function getTags({ gateway, inbounds }: DataplaneNetworking): LabelValue[] {
  let tags: string[] = []
  const separator = '='

  if (inbounds.length > 0) {
    tags = inbounds
      .flatMap((inbound) => Object.entries(inbound.tags))
      .map(([key, value]) => `${key}${separator}${value}`)
  }

  if (gateway) {
    tags = Object.entries(gateway.tags).map(([key, value]) => `${key}${separator}${value}`)
  }

  const uniqueTags = Array.from(new Set(tags))

  uniqueTags.sort((tagPairA, tagPairB) => tagPairA.localeCompare(tagPairB))

  return uniqueTags.map((tagPair) => {
    const [label, value] = tagPair.split(separator)
    return { label, value }
  })
}

function getIsCertExpired({ mTLS }: DataplaneInsight): boolean {
  return mTLS ? Date.now() > new Date(mTLS.certificateExpirationTime).getTime() : false
}

function getWarnings({ version }: DataplaneInsight, tags: LabelValue[], canUseZones: boolean): DataplaneWarning[] {
  if (typeof version === 'undefined') {
    return []
  }

  const warnings: DataplaneWarning[] = []
  if (version.kumaDp && version.envoy) {
    const isKumaCpCompatible = version.kumaDp?.kumaCpCompatible ?? true
    if (!isKumaCpCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_UNSUPPORTED_KUMA_DP',
        payload: {
          kumaDp: version.kumaDp.version,
        },
      })
    }

    const isKumaDpCompatible = version.envoy?.kumaDpCompatible ?? true
    if (!isKumaDpCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_UNSUPPORTED_ENVOY',
        payload: {
          envoy: version.envoy.version,
          kumaDp: version.kumaDp.version,
        },
      })
    }
  }

  if (canUseZones) {
    const zoneTag = tags.find(tag => tag.label === 'kuma.io/zone')

    if (zoneTag && typeof version.kumaDp.kumaCpCompatible === 'boolean' && !version.kumaDp.kumaCpCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS',
        payload: {
          kumaDp: version.kumaDp.version,
        },
      })
    }
  }

  return warnings
}
