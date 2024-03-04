/* eslint multiline-ternary: ["off"] */
import type { Connection } from '@/app/connections/data'
import { DiscoverySubscriptionCollection, type DiscoverySubscription } from '@/app/subscriptions/data'
import type { ApiKindListResponse, PaginatedApiListResponse } from '@/types/api.d'
import type {
  DataPlane as PartialDataplane,
  DataplaneGateway as PartialDataplaneGateway,
  DataplaneInbound as PartialDataplaneInbound,
  DataPlaneInsight as PartialDataplaneInsight,
  DataplaneNetworking as PartialDataplaneNetworking,
  DataplaneOutbound as PartialDataplaneOutbound,
  DataPlaneOverview as PartialDataplaneOverview,
  DataPlaneProxyStatus as DataplaneStatusCount,
  DataplaneWarning,
  InspectBaseRule,
  InspectInbound,
  InspectRulesForDataplane as PartialInspectRulesForDataplane,
  LabelValue,
  MatchedPolicyType,
  MeshGatewayDataplane as PartialMeshGatewayDataplane,
  MeshGatewayListenerEntry,
  MeshGatewayRouteEntry,
  Meta,
  PolicyTypeEntry,
  PolicyTypeEntryConnection,
  SidecarDataplane as PartialSidecarDataplane,
} from '@/types/index.d'
import { isSet } from '@/utilities/isSet'

export type DataplaneInbound = PartialDataplaneInbound & Connection & {
  health: {
    ready: boolean
  }
  addressPort: string
  serviceAddressPort: string
}
export type DataplaneOutbound = PartialDataplaneOutbound & Connection & {
}

export type DataplaneGateway = PartialDataplaneGateway & {}

export type DataplaneNetworking = Omit<PartialDataplaneNetworking, 'inbound' | 'outbound'> & {
  inbounds: DataplaneInbound[]
  outbounds: DataplaneOutbound[]
  inboundName: string
  type: 'delegated' | 'builtin' | 'standard'
}

export type Dataplane = PartialDataplane & {
  config: PartialDataplane
  networking: DataplaneNetworking
}

export type DataplaneInsight = PartialDataplaneInsight & DiscoverySubscriptionCollection & {}

export type DataplaneOverview = PartialDataplaneOverview & {
  dataplane: {
    networking: DataplaneNetworking
  }
  dataplaneInsight: DataplaneInsight
  dataplaneType: 'standard' | 'builtin' | 'delegated'
  status: 'online' | 'offline' | 'partially_degraded'
  warnings: DataplaneWarning[]
  isCertExpired: boolean
  zone: string | undefined
  services: string[]
}

export type SidecarDataplane = PartialSidecarDataplane

export type MeshGatewayDataplane = PartialMeshGatewayDataplane & {
  listenerEntries: MeshGatewayListenerEntry[]
  routePolicies: Meta[]
}

const DataplaneNetworking = {
  fromObject(networking: PartialDataplaneNetworking, defaultHealth: boolean): DataplaneNetworking {
    // remove singular inbound/outbound to be replaced with plural versions
    const { inbound, outbound, ...rest } = networking

    const inbounds = Array.isArray(inbound) ? inbound : []

    // outbounds are only present here on a universal DDP without transparent
    // proxying
    const outbounds = Array.isArray(outbound) ? outbound : []
    const type = getDataplaneType(networking)
    return {
      ...rest,
      type,
      // inboundNames are `localhost` for a sidecar, the service name for a gateway.
      // The service name "as an inbound" will never be found for a delegated gateway
      inboundName: typeof networking.gateway === 'undefined' ? 'localhost' : networking.gateway.tags['kuma.io/service'],
      // guess a single inbound for the moment
      // we need to fill this in and make it multiple by either using the policy info
      // or the stats listeners info
      inbounds: (typeof networking.gateway !== 'undefined' && type === 'builtin')
        ? [{
          name: networking.gateway.tags['kuma.io/service'],
          tags: networking.gateway.tags,
          service: networking.gateway.tags['kuma.io/service'],
          //
          health: { ready: defaultHealth },
          protocol: networking.gateway.tags['kuma.io/protocol'] ?? 'tcp',
          // we currently never display the below data for gateway inbounds
          port: NaN,
          address: networking.address,
          addressPort: '',
          serviceAddressPort: '',
        }]
        : inbounds.map((item) => {
          return {
            ...item,
            // Envoy Stats use `localhost_0000` for sidecar inbounds
            name: `localhost_${item.port}`,
            // If a health property is unset the inbound is considered healthy
            health: { ready: !isSet(item.health) ? true : item.health.ready },
            service: item.tags['kuma.io/service'],
            protocol: item.tags['kuma.io/protocol'] ?? 'tcp',
            addressPort: `${item.address ?? networking.advertisedAddress ?? networking.address}:${item.port}`,
            serviceAddressPort: `${item.serviceAddress ?? item.address ?? networking.address}:${item.servicePort ?? item.port}`,
          }
        }),
      outbounds: outbounds.map((item) => {
        return {
          ...item,
          name: item.tags['kuma.io/service'],
          service: item.tags['kuma.io/service'],
          protocol: item.tags['kuma.io/protocol'] ?? 'tcp',
        }
      }),
    }
  },
}

export const Dataplane = {
  fromObject(partialDataplane: PartialDataplane): Dataplane {
    return {
      ...partialDataplane,
      config: partialDataplane,
      networking: DataplaneNetworking.fromObject(partialDataplane.networking, true),
    }
  },
}

const DataplaneInsight = {
  fromObject(item: PartialDataplaneInsight | undefined): DataplaneInsight {
    return {
      ...item,
      ...DiscoverySubscriptionCollection.fromArray(item?.subscriptions),
    }
  },
}

export const DataplaneOverview = {
  fromObject(partialDataplaneOverview: PartialDataplaneOverview, canUseZones: boolean): DataplaneOverview {
    const dataplaneInsight = DataplaneInsight.fromObject(partialDataplaneOverview.dataplaneInsight)

    const networking = DataplaneNetworking.fromObject(partialDataplaneOverview.dataplane.networking, typeof dataplaneInsight.connectedSubscription !== 'undefined')

    const status = getStatus(networking, dataplaneInsight.connectedSubscription)
    const tags = getTags(networking)
    const warnings = getWarnings(dataplaneInsight, tags, canUseZones)
    const isCertExpired = getIsCertExpired(dataplaneInsight)
    const services = tags.filter((tag) => tag.label === 'kuma.io/service').map(({ value }) => value)
    const zone = tags.find((tag) => tag.label === 'kuma.io/zone')?.value

    return {
      ...partialDataplaneOverview,
      dataplane: {
        networking,
      },
      dataplaneInsight,
      dataplaneType: networking.type,
      status,
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

export const SidecarDataplane = {
  fromCollection(partialSidecarDataplanes: ApiKindListResponse<PartialSidecarDataplane>): ApiKindListResponse<SidecarDataplane> & { policyTypeEntries: PolicyTypeEntry[] } {
    const items = Array.isArray(partialSidecarDataplanes.items) ? partialSidecarDataplanes.items : []
    const policyTypeEntries = getPolicyTypeEntries(items)

    return {
      ...partialSidecarDataplanes,
      items,
      policyTypeEntries,
    }
  },
}
export type Rule = Omit<InspectBaseRule, 'conf' | 'origin'> & {
  type: string
  ruleType: string
  inbound?: InspectInbound
  config: InspectBaseRule['conf']
  origins: InspectBaseRule['origin']
}
export type RuleCollection = Omit<PartialInspectRulesForDataplane, 'rules'> & {
  rules: Rule[]
}
export const Rule = {
  fromObject(item: InspectBaseRule): Rule {
    const { conf, origin, matchers, ...rest } = item
    return {
      type: '',
      ruleType: '',
      ...rest,
      config: Object.keys(conf || {}).length > 0 ? conf : {},
      origins: Array.isArray(origin) ? origin : [],
      matchers: Array.isArray(matchers) ? matchers : [],
    }
  },
  fromCollection(partialInspectRules: PartialInspectRulesForDataplane): RuleCollection {
    const rules = Array.isArray(partialInspectRules.rules) ? partialInspectRules.rules.reduce<Rule[]>((prev, item) => {
      // to rules we can just reshape.
      const to = Array.isArray(item.toRules) ? item.toRules.map(rule => {
        return {
          ...Rule.fromObject(rule),
          type: item.type,
          ruleType: 'to',
        }
      }) : []

      // from rules we can need to flatten out with reduce
      const from = Array.isArray(item.fromRules) ? item.fromRules.reduce<Rule[]>((prev, rule) => {
        const { rules, ...rest } = rule
        return prev.concat(rules.map(r => {
          return {
            ...rest,
            ...Rule.fromObject(r),
            type: item.type,
            ruleType: 'from',
          }
        }))
      }, []) : []

      // the proxyRule is only ever a single one, but we turn it into an array
      // with a single entry so it looks like to and from rules
      const proxy = typeof item.proxyRule !== 'undefined' ? [{
        ...Rule.fromObject(item.proxyRule as InspectBaseRule),
        type: item.type,
        ruleType: 'proxy',
      }] : []

      // concat all the rules now thay all look the same
      return prev.concat(to).concat(from).concat(proxy)
    }, []) : []
    return {
      ...partialInspectRules,
      rules,
    }
  },
}

export const MeshGatewayDataplane = {
  fromObject(partialMeshGatewayDataplane: PartialMeshGatewayDataplane): MeshGatewayDataplane {
    const listenerEntries = getListenerEntries(partialMeshGatewayDataplane)
    const routePolicies = Object.values(partialMeshGatewayDataplane.policies ?? {}).map(({ mesh, name, type }) => ({ mesh, name, type }))

    return {
      ...partialMeshGatewayDataplane,
      listenerEntries,
      routePolicies,
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
  if (!isSet(version)) {
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

function getDataplaneType({ gateway }: PartialDataplaneNetworking): 'standard' | 'builtin' | 'delegated' {
  if (gateway) {
    if (gateway.type) {
      return gateway.type.toLowerCase() as 'builtin' | 'delegated'
    } else {
      // Dataplanes with a gateway property but without a type are delegated gateways.
      return 'delegated'
    }
  }

  return 'standard'
}

/**
 * Transforms `SidecarDataplane` objects into policy type entries which are going to be displayed in this view.
 */
function getPolicyTypeEntries(sidecarDataplanes: PartialSidecarDataplane[]): PolicyTypeEntry[] {
  // Uses a `Map` to store entries by type so they can be retrieved and updated while iterating over the `SidecarDataplane` objects.
  const policyTypeEntriesByType = new Map<string, PolicyTypeEntry>()

  for (const sidecarDataplane of sidecarDataplanes) {
    const { type, service } = sidecarDataplane

    // The `service` field, when set, represents the name of the destination service of traffic.
    const destinationTags: LabelValue[] = typeof service === 'string' && service !== '' ? [{ label: 'kuma.io/service', value: service }] : []
    const name = type === 'inbound' || type === 'outbound' ? sidecarDataplane.name : null

    for (const [policyTypeName, policies] of Object.entries(sidecarDataplane.matchedPolicies)) {
      if (!policyTypeEntriesByType.has(policyTypeName)) {
        policyTypeEntriesByType.set(policyTypeName, {
          type: policyTypeName,
          connections: [],
        })
      }

      const policyTypeEntry = policyTypeEntriesByType.get(policyTypeName)!

      for (const policy of policies) {
        const connections = getPolicyTypeEntryConnections(policy, sidecarDataplane, destinationTags, name)

        policyTypeEntry.connections.push(...connections)
      }
    }
  }

  const policyTypeEntries = Array.from(policyTypeEntriesByType.values())

  policyTypeEntries.sort((policyTypeEntryA, policyTypeEntryB) => policyTypeEntryA.type.localeCompare(policyTypeEntryB.type))

  return policyTypeEntries
}

function getPolicyTypeEntryConnections(policy: MatchedPolicyType, sidecarDataplane: SidecarDataplane, destinationTags: LabelValue[], name: string | null): PolicyTypeEntryConnection[] {
  const config = policy.conf && Object.keys(policy.conf).length > 0 ? policy.conf : undefined
  const origins = [{
    name: policy.name,
    mesh: policy.mesh,
    type: policy.type,
  }]

  const policyTypeEntryConnections: PolicyTypeEntryConnection[] = []

  if (sidecarDataplane.type === 'inbound' && Array.isArray(policy.sources)) {
    for (const { match } of policy.sources) {
      const sourceTags: LabelValue[] = [{ label: 'kuma.io/service', value: match['kuma.io/service'] }]
      const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

      policyTypeEntryConnections.push(connection)
    }
  } else {
    const sourceTags: LabelValue[] = []
    const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

    policyTypeEntryConnections.push(connection)
  }

  return policyTypeEntryConnections
}

function getListenerEntries(meshGatewayDataplane: PartialMeshGatewayDataplane): MeshGatewayListenerEntry[] {
  const meshGatewayListenerEntries: MeshGatewayListenerEntry[] = []

  const listeners = meshGatewayDataplane.listeners ?? []
  for (const listener of listeners) {
    for (const host of listener.hosts) {
      for (const route of host.routes) {
        const routeEntries: MeshGatewayRouteEntry[] = []

        for (const destination of route.destinations) {
          const origins = Object.values(destination.policies ?? {}).map(({ mesh, name, type }) => ({ mesh, name, type }))

          routeEntries.push({
            route: {
              mesh: meshGatewayDataplane.gateway.mesh,
              name: route.route,
              type: 'MeshGatewayRoute',
            },
            service: destination.tags['kuma.io/service'],
            origins,
          })
        }

        meshGatewayListenerEntries.push({
          protocol: listener.protocol,
          port: listener.port,
          hostName: host.hostName,
          routeEntries,
        })
      }
    }
  }

  return meshGatewayListenerEntries
}

export function getDataplaneStatusCounts({ total = 0, online = 0, partiallyDegraded = 0, offline = 0 }: DataplaneStatusCount): Required<DataplaneStatusCount> {
  return {
    total,
    online,
    partiallyDegraded,
    offline,
  }
}

function getStatus({ gateway, inbounds }: DataplaneNetworking, connectedSubscription: DiscoverySubscription | undefined): 'online' | 'offline' | 'partially_degraded' {
  const state = isSet(connectedSubscription) ? 'online' : 'offline'

  if (gateway) {
    return state
  }

  const unhealthyInbounds = inbounds.filter((inbound) => !inbound.health.ready)

  switch (true) {
    case unhealthyInbounds.length === inbounds.length:
      // All inbounds being unhealthy means the Dataplane is offline.
      return 'offline'
    case unhealthyInbounds.length > 0:
      // Some inbounds being unhealthy means the Dataplane is partially degraded.
      return 'partially_degraded'
    default:
      // All inbounds being healthy means the Dataplane’s status is determined by whether it’s connected to a control plane.
      return state
  }
}
