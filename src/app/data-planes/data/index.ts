import { getIsConnected, SubscriptionCollection } from '@/app/subscriptions/data'
import type { ApiKindListResponse, PaginatedApiListResponse } from '@/types/api.d'
import type {
  DataPlane as PartialDataplane,
  DataplaneInbound as PartialDataplaneInbound,
  DataPlaneInsight as PartialDataplaneInsight,
  DataplaneNetworking as PartialDataplaneNetworking,
  DataplaneOutbound as PartialDataplaneOutbound,
  DataPlaneOverview as PartialDataplaneOverview,
  DataPlaneProxyStatus as DataplaneStatusCount,
  DataplaneWarning,
  DiscoverySubscription,
  InspectBaseRule,
  InspectRule,
  InspectRulesForDataplane as PartialInspectRulesForDataplane,
  LabelValue,
  MatchedPolicyType,
  MeshGatewayDataplane as PartialMeshGatewayDataplane,
  MeshGatewayListenerEntry,
  MeshGatewayRouteEntry,
  Meta,
  PolicyTypeEntry,
  PolicyTypeEntryConnection,
  RuleEntry,
  RuleEntryRule,
  SidecarDataplane as PartialSidecarDataplane,
} from '@/types/index.d'

type DiscoverySubscriptionCollection = {
} & SubscriptionCollection<DiscoverySubscription>

export type DataplaneInbound = PartialDataplaneInbound & {
  health: {
    ready: boolean
  }
  addressPort: string
  serviceAddressPort: string
}

export type DataplaneOutbound = PartialDataplaneOutbound

export type DataplaneNetworking = Omit<PartialDataplaneNetworking, 'inbound' | 'outbound'> & {
  inbounds: DataplaneInbound[]
  outbounds: DataplaneOutbound[]
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
  unhealthyInbounds: Array<{ service: string, port: number }>
  lastUpdateTime?: string | undefined
  warnings: DataplaneWarning[]
  isCertExpired: boolean
  services: string[]
}

export type SidecarDataplane = PartialSidecarDataplane

export type InspectRulesForDataplane = PartialInspectRulesForDataplane & {
  proxyRule: RuleEntry | undefined
  toRules: RuleEntry[]
  fromRuleInbounds: Array<{ port: number, ruleEntries: RuleEntry[] }>
}

export type MeshGatewayDataplane = PartialMeshGatewayDataplane & {
  listenerEntries: MeshGatewayListenerEntry[]
  routePolicies: Meta[]
}

const DataplaneNetworking = {
  fromObject(partialDataplaneNetworking: PartialDataplaneNetworking): DataplaneNetworking {
    const { inbound, outbound, ...rest } = partialDataplaneNetworking

    const inbounds: DataplaneInbound[] = (inbound ?? []).map((inbound) => {
      // An inbound without a health property is considered healthy.
      const health = { ready: !inbound.health || inbound.health.ready }
      const addressPort = `${inbound.address ?? partialDataplaneNetworking.advertisedAddress ?? partialDataplaneNetworking.address}:${inbound.port}`
      const serviceAddressPort = `${inbound.serviceAddress ?? inbound.address ?? partialDataplaneNetworking.address}:${inbound.servicePort ?? inbound.port}`

      return {
        ...inbound,
        health,
        addressPort,
        serviceAddressPort,
      }
    })

    const outbounds: DataplaneOutbound[] = outbound ?? []

    return {
      ...rest,
      inbounds,
      outbounds,
    }
  },
}

export const Dataplane = {
  fromObject(partialDataplane: PartialDataplane): Dataplane {
    return {
      ...partialDataplane,
      config: partialDataplane,
      networking: DataplaneNetworking.fromObject(partialDataplane.networking),
    }
  },
}

const DiscoverySubscriptionCollection = {
  fromArray: (items?: DiscoverySubscription[]): DiscoverySubscriptionCollection => {
    return SubscriptionCollection.fromArray(items)
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
    const networking = DataplaneNetworking.fromObject(partialDataplaneOverview.dataplane.networking)

    const lastUpdateTime = dataplaneInsight.latestSubscription?.status.lastUpdateTime
    const dataplaneType = getDataplaneType(networking)
    const status = getStatus(partialDataplaneOverview)
    const unhealthyInbounds = getUnhealthyInbounds(networking)
    const tags = getTags(networking)
    const services = tags.filter((tag) => tag.label === 'kuma.io/service').map(({ value }) => value)
    const warnings = getWarnings(dataplaneInsight, tags, canUseZones)
    const isCertExpired = getIsCertExpired(dataplaneInsight)

    return {
      ...partialDataplaneOverview,
      dataplane: {
        networking,
      },
      dataplaneInsight,
      dataplaneType,
      status,
      unhealthyInbounds,
      lastUpdateTime,
      warnings,
      isCertExpired,
      services,
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

export const InspectRules = {
  fromCollection(partialInspectRules: PartialInspectRulesForDataplane): InspectRulesForDataplane & {} {
    const rules = Array.isArray(partialInspectRules.rules) ? partialInspectRules.rules : []
    const proxyRule = getProxyRule(rules)
    const toRules = getToRules(rules)
    const fromRuleInbounds = getFromRuleInbounds(rules)

    return {
      ...partialInspectRules,
      rules,
      proxyRule,
      toRules,
      fromRuleInbounds,
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

// TODO: Update the implementation once OnboardingDataplanesView no longer uses this function and remove the export.
export function getStatus(dataplaneOverview: PartialDataplaneOverview): 'online' | 'offline' | 'partially_degraded' {
  const isConnected = getIsConnected(dataplaneOverview.dataplaneInsight?.subscriptions)
  // For gateways, the only relevant status criteria are subscriptions.
  if (dataplaneOverview.dataplane.networking.gateway) {
    return isConnected ? 'online' : 'offline'
  }

  // TODO: Update this to use the transformed inbounds property instead and check for `!inbound.isHealthy`.
  const inbounds = dataplaneOverview.dataplane.networking.inbound ?? []
  const unhealthyInbounds = inbounds.filter((inbound) => inbound.health && !inbound.health.ready)

  switch (true) {
    case unhealthyInbounds.length === inbounds.length:
      // All inbounds being unhealthy means the Dataplane is offline.
      return 'offline'
    case unhealthyInbounds.length > 0:
      // Some inbounds being unhealthy means the Dataplane is partially degraded.
      return 'partially_degraded'
    default:
      // All inbounds being healthy means the Dataplane’s status is determined by whether it’s connected to a control plane.
      return isConnected ? 'online' : 'offline'
  }
}

function getUnhealthyInbounds({ inbounds }: DataplaneNetworking): Array<{ service: string, port: number }> {
  return inbounds
    .filter((inbound) => !inbound.health.ready)
    .map(({ tags, port }) => ({ service: tags['kuma.io/service'], port }))
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

function getWarnings({ subscriptions }: DataplaneInsight, tags: LabelValue[], canUseZones: boolean): DataplaneWarning[] {
  const lastSubscription = subscriptions.at(-1)
  if (!lastSubscription || !lastSubscription.version) {
    return []
  }

  const warnings: DataplaneWarning[] = []
  const version = lastSubscription.version
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

function getDataplaneType({ gateway }: DataplaneNetworking): 'standard' | 'builtin' | 'delegated' {
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

function getProxyRule(rules: InspectRule[]): RuleEntry | undefined {
  // Note, there can only be one proxy rule.
  const rule = rules.find((rule) => rule.proxyRule)
  if (!rule || !rule.proxyRule) {
    return undefined
  }

  const { type, proxyRule } = rule

  const config = proxyRule.conf && Object.keys(proxyRule.conf).length > 0 ? proxyRule.conf : undefined
  const origins = proxyRule.origin

  return {
    type,
    rules: [
      {
        config,
        origins,
      },
    ],
  }
}

function getToRules(rules: InspectRule[]): RuleEntry[] {
  const ruleEntries: RuleEntry[] = []

  for (const rule of rules) {
    const toRules = rule.toRules ?? []

    if (toRules.length > 0) {
      ruleEntries.push({
        type: rule.type,
        rules: getRules(toRules),
      })
    }
  }

  ruleEntries.sort((ruleEntryA, ruleEntryB) => ruleEntryA.type.localeCompare(ruleEntryB.type))

  return ruleEntries
}

function getFromRuleInbounds(rules: InspectRule[]): Array<{ port: number, ruleEntries: RuleEntry[] }> {
  // Group rule entries by inbound
  const ruleEntriesByInbound = new Map<number, RuleEntry[]>()

  for (const rule of rules) {
    const fromRules = rule.fromRules ?? []
    if (fromRules.length === 0) {
      continue
    }

    for (const fromRule of fromRules) {
      if (!ruleEntriesByInbound.has(fromRule.inbound.port)) {
        ruleEntriesByInbound.set(fromRule.inbound.port, [])
      }

      // This access is safe because we previously ensured this Map item exists.
      const ruleEntries = ruleEntriesByInbound.get(fromRule.inbound.port)!
      ruleEntries.push({
        type: rule.type,
        rules: getRules(fromRule.rules),
      })
    }
  }

  for (const [, ruleEntries] of ruleEntriesByInbound) {
    ruleEntries.sort((ruleEntryA, ruleEntryB) => ruleEntryA.type.localeCompare(ruleEntryB.type))
  }

  const fromRules = Array.from(ruleEntriesByInbound)
  fromRules.sort(([portA], [portB]) => portB - portA)

  return fromRules.map(([port, ruleEntries]) => ({ port, ruleEntries }))
}

function getRules(rules: InspectBaseRule[]): RuleEntryRule[] {
  return rules.map(({ conf, matchers, origin: origins }) => {
    const config = conf && Object.keys(conf).length > 0 ? conf : undefined

    return {
      config,
      matchers,
      origins,
    }
  })
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
