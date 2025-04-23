import { Dataplane } from './Dataplane'
import { DataplaneInsight } from './DataplaneInsight'
import { DataplaneNetworking } from './DataplaneNetworking'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  DataPlaneOverview as PartialDataplaneOverview,
  LabelValue,
} from '@/types/index.d'

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
  namespace: 'k8s.kuma.io/namespace',
}
const states = {
  online: 'online',
  offline: 'offline',
  partiallyDegraded: 'partially_degraded',
} as const
const dpTypes = {
  builtin: 'builtin',
  delegated: 'delegated',
  standard: 'standard',
} as const

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
  fromObject(item: PartialDataplaneOverview) {
    const dataplaneInsight = DataplaneInsight.fromObject(item.dataplaneInsight)

    const networking = DataplaneNetworking.fromObject(item.dataplane.networking)

    const tags = getTags(networking)
    const isCertExpired = getIsCertExpired(dataplaneInsight)
    const services = tags.filter((tag) => tag.label === 'kuma.io/service').map(({ value }) => value)
    const zone = tags.find((tag) => tag.label === 'kuma.io/zone')?.value
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}

    const { config } = Dataplane.fromObject({
      type: 'Dataplane',
      name: item.name,
      mesh: item.mesh,
      creationTime: item.creationTime,
      modificationTime: item.modificationTime,
      networking: item.dataplane.networking,
    })

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
      dataplaneType: networking.type === 'gateway' ? dpTypes.builtin : typeof networking.gateway !== 'undefined' ? dpTypes.delegated : dpTypes.standard,
      status: (() => {
        const state = typeof dataplaneInsight.connectedSubscription !== 'undefined' ? states.online : states.offline
        if (networking.gateway) {
          return state
        }

        const unhealthyInbounds = networking.inbounds.filter((inbound) => inbound.state !== 'Ready')
        switch (true) {
          case unhealthyInbounds.length === networking.inbounds.length:
            // All inbounds being unhealthy means the Dataplane is offline.
            return states.offline
          case unhealthyInbounds.length > 0:
            // Some inbounds being unhealthy means the Dataplane is partially degraded.
            return states.partiallyDegraded
          default:
            // All inbounds being healthy means the Dataplane’s status is determined by whether it’s connected to a control plane.
            return state
        }
      })(),
      isCertExpired,
      services,
      zone,
      config,
    }
  },

  fromCollection(partialDataplaneOverviews: PaginatedApiListResponse<PartialDataplaneOverview>) {
    return {
      ...partialDataplaneOverviews,
      items: Array.isArray(partialDataplaneOverviews.items)
        ? partialDataplaneOverviews.items.map((partialDataplaneOverview) => DataplaneOverview.fromObject(partialDataplaneOverview))
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

export type DataplaneOverview = ReturnType<typeof DataplaneOverview.fromObject>
