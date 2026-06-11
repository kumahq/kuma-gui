import { Dataplane } from './Dataplane'
import { DataplaneInsight } from './DataplaneInsight'
import { DataplaneNetworking } from './DataplaneNetworking'
import { Kri } from '@/app/kuma/kri'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  DataPlaneOverview as PartialDataplaneOverview,
  LabelValue,
} from '@/types/index.d'

const states = {
  online: 'online',
  offline: 'offline',
  partiallyDegraded: 'partially_degraded',
  disconnectedCp: 'disconnected_cp',
} as const
const dpTypes = {
  builtin: 'builtin',
  delegated: 'delegated',
  standard: 'standard',
} as const

export const DataplaneOverview = {
  fromObject(item: PartialDataplaneOverview) {
    const dataplaneInsight = DataplaneInsight.fromObject(item.dataplaneInsight)

    const networking = DataplaneNetworking.fromObject(item.dataplane.networking)

    const tags = getTags(networking)
    const isCertExpired = getIsCertExpired(dataplaneInsight)
    const isCertExpiresSoon = getIsCertExpiresSoon(dataplaneInsight)

    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    // check for label first, fallback to tags
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : tags.find((tag) => tag.label === 'kuma.io/zone')?.value ?? ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    // temporarily make a KRI until we have those from the backend
    const kri = Kri.toString({ shortName: 'dp', mesh, zone, namespace, name })


    // get all tags and labels with kuma.io/service
    // uniquify and and sort
    const services = Array.from(new Set([
      ...tags.filter((tag) => tag.label === 'kuma.io/service').map(({ value }) => value),
      ...(labels['kuma.io/service'] ? [labels['kuma.io/service']] : []),
    ])).sort((a, b) => a.localeCompare(b))



    return {
      ...item,
      kri,
      name,
      mesh,
      labels,
      creationTime: item.creationTime ?? '',
      modificationTime: item.modificationTime ?? '',
      // aliases
      id,
      namespace,
      zone,

      dataplaneInsight,
      dataplane: {
        networking,
      },
      dataplaneType: (() => {
        switch (true) {
          case networking.type === 'gateway':
            return dpTypes.builtin
          case typeof networking.gateway !== 'undefined':
            return dpTypes.delegated
          default:
            return dpTypes.standard
        }
      })(),
      zoneProxyTypes: [
        ...labels['kuma.io/listener-zoneingress'] ? ['zone-ingress'] : [],
        ...labels['kuma.io/listener-zoneegress'] ? ['zone-egress'] : [],
      ],
      status: (() => {
        const state = typeof dataplaneInsight.connectedSubscription !== 'undefined' ? states.online : states.disconnectedCp
        if (networking.gateway || state === states.disconnectedCp) {
          return state
        }

        const networkEndpoints = networking.inbounds
        const unhealthy = networkEndpoints.filter((endpoint) => endpoint.state !== 'Ready')
        switch (true) {
          case unhealthy.length === 0:
            // No unhealthy network endpoints means the Dataplane is online.
            return states.online
          case unhealthy.length === networkEndpoints.length:
            // All network endpoints being unhealthy means the Dataplane is offline.
            return states.offline
          case unhealthy.length > 0:
            // Some network endpoints being unhealthy means the Dataplane is partially degraded.
            return states.partiallyDegraded
          default:
            // All network endpoints being healthy means the Dataplane’s status is determined by whether it’s connected to a control plane.
            return state
        }
      })(),
      isCertExpired,
      isCertExpiresSoon,
      services,
      // config should only contain non-defaulted values
      // because we want to show what the API responded with
      // we then copy over things that should be on the Entity, but
      // are only on the EntityOverview
      config: {
        ...Dataplane.fromObject({
          // bare minimum props to keep TS happy
          // plus a splat of the original Entity
          type: 'Dataplane',
          name: item.name,
          mesh: item.mesh,
          ...item.dataplane,
        }).config,

        // the things we copy over
        // kri is always missing and we always purposefully add and generate ourselves
        kri,
        // we only copy these over if they exist
        ...(typeof item.labels !== 'undefined' ? { labels: item.labels } : {}),
        ...(typeof item.creationTime !== 'undefined' ? { creationTime: item.creationTime } : {}),
        ...(typeof item.modificationTime !== 'undefined' ? { modificationTime: item.modificationTime } : {}),
      },
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
    tags = Object.entries(gateway.tags ?? {}).map(([key, value]) => `${key}${separator}${value}`)
  }

  const uniqueTags = Array.from(new Set(tags))

  uniqueTags.sort((tagPairA, tagPairB) => tagPairA.localeCompare(tagPairB))

  return uniqueTags.map((tagPair) => {
    const [label, value] = tagPair.split(separator)
    return { label, value }
  })
}

function getIsCertExpired({ mTLS }: DataplaneInsight): boolean {
  return mTLS?.certificateExpirationTime ? Date.now() > new Date(mTLS.certificateExpirationTime).getTime() : false
}

function getIsCertExpiresSoon({ mTLS }: DataplaneInsight): boolean {
  if (!mTLS?.certificateExpirationTime) return false
  const expiryTime = new Date(mTLS.certificateExpirationTime).getTime()
  const expiresSoonThreshold = 1_000 * 60 * 60 * 6 // 6 hours
  return Date.now() > expiryTime - expiresSoonThreshold && Date.now() < expiryTime
}

export type DataplaneOverview = ReturnType<typeof DataplaneOverview.fromObject>
