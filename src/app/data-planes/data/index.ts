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
  ToTargetRefRule as PartialToTargetRefRule,
  TargetRef,
  ToTargetRefFilter,
} from '@/types/index.d'
import { isSet } from '@/utilities/isSet'

type Connection = {
  name: string
  service: string
  protocol: string
}
export type DataplaneInbound = PartialDataplaneInbound & Connection & {
  address: string
  health: {
    ready: boolean
  }
  addressPort: string
  serviceAddressPort: string
  listenerAddress: string
}
export type DataplaneOutbound = PartialDataplaneOutbound & Connection & {
}

export type DataplaneGateway = PartialDataplaneGateway & {}

export type DataplaneNetworking = Omit<PartialDataplaneNetworking, 'inbound' | 'outbound'> & {
  inboundAddress: string
  inbounds: DataplaneInbound[]
  outbounds: DataplaneOutbound[]
  type: 'sidecar' | 'gateway'
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

export type SidecarDataplane = PartialSidecarDataplane

export type MeshGatewayDataplane = PartialMeshGatewayDataplane & {
  listenerEntries: MeshGatewayListenerEntry[]
  routePolicies: Meta[]
}
const DataplaneOutbound = {
  fromObject(item: PartialDataplaneOutbound): DataplaneOutbound {
    return {
      ...item,
      name: item.tags['kuma.io/service'],
      service: item.tags['kuma.io/service'],
      protocol: item.tags['kuma.io/protocol'] ?? 'tcp',
    }
  },
  fromCollection(items: PartialDataplaneOutbound[]): DataplaneOutbound[] {
    return Array.isArray(items) ? items.map(item => DataplaneOutbound.fromObject(item)) : []
  },
}
const DataplaneNetworking = {
  fromObject(networking: PartialDataplaneNetworking, defaultHealth: boolean): DataplaneNetworking {
    // remove singular inbound/outbound to be replaced with plural versions
    const { inbound, outbound, ...rest } = networking

    const inbounds = Array.isArray(inbound) ? inbound : []

    // outbounds are only present here on a universal DDP without transparent
    // proxying
    const outbounds = Array.isArray(outbound) ? outbound : []
    const type = typeof networking.gateway === 'undefined' || networking.gateway?.type !== 'BUILTIN' ? 'sidecar' : 'gateway'
    return {
      ...rest,
      type,
      // used for a lookup for inbounds on the result of the envoy /stats endpoint
      inboundAddress: type === 'gateway' ? networking.address : 'localhost',
      //
      // if we are a builtin gateway fill in as much as we can for a single inbound
      // we can 'clone' this later if we find out individual information for each inbound
      // i.e. this acts as a template
      inbounds: type === 'gateway' && typeof networking.gateway !== 'undefined'
        ? [{
          address: networking.address,
          tags: networking.gateway.tags,
          name: networking.gateway.tags['kuma.io/service'],
          service: networking.gateway.tags['kuma.io/service'],
          protocol: networking.gateway.tags['kuma.io/protocol'] ?? 'tcp',
          // TODO
          health: { ready: defaultHealth },
          // these could be filled out during 'cloning'
          // i.e. these are like template variables to be filled out
          port: NaN,
          addressPort: '',
          //
          // this will never get set seeing as a gateway proxy never has a service
          serviceAddressPort: '',
          // we never set this currently as we never need it for a gateway
          listenerAddress: '',
        }]
        : inbounds.map((item) => {
          const address = item.address ?? networking.address
          const port = item.servicePort ?? item.port
          return {
            ...item,
            // the name can be used to lookup listener envoy stats
            name: `localhost_${port}`,
            listenerAddress: `${address}_${port}`,
            // If a health property is unset the inbound is considered healthy
            health: { ready: !isSet(item.health) ? true : item.health.ready },
            service: item.tags['kuma.io/service'],
            protocol: item.tags['kuma.io/protocol'] ?? 'tcp',
            address,
            // inbound address, advertisedAddress, networkingAddress because externally accessible address
            addressPort: `${item.address ?? networking.advertisedAddress ?? networking.address}:${item.port}`,
            // inbound serviceAddress, inbound address, networkingAddress because the internal services accessible address
            serviceAddressPort: `${item.serviceAddress ?? address}:${port}`,
          }
        }),
      outbounds: DataplaneOutbound.fromCollection(outbounds),
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
  fromObject(item: PartialDataplaneOverview, canUseZones: boolean): DataplaneOverview {
    const dataplaneInsight = DataplaneInsight.fromObject(item.dataplaneInsight)

    const networking = DataplaneNetworking.fromObject(item.dataplane.networking, typeof dataplaneInsight.connectedSubscription !== 'undefined')

    const status = getStatus(networking, dataplaneInsight.connectedSubscription)
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

export type ToTargetRefRule = Exclude<PartialToTargetRefRule, 'default'> & {
  default: {
    backendRefs: TargetRef[]
    filters: ToTargetRefFilter[]
  }
}

type RuleConf = Exclude<InspectBaseRule['conf'], 'hostnames' | 'rules'> & {
  hostnames: string[]
  rules: ToTargetRefRule[]
}

export type Rule = Omit<InspectBaseRule, 'conf' | 'origin'> & {
  type: string
  ruleType: 'to' | 'from' | 'proxy'
  inbound?: InspectInbound
  raw: InspectBaseRule['conf']
  config: RuleConf
  origins: InspectBaseRule['origin']
}
export type RuleCollection = Omit<PartialInspectRulesForDataplane, 'rules'> & {
  rules: Rule[]
}
export const Rule = {
  fromObject(item: InspectBaseRule): Rule {
    const { conf = {}, origin, matchers, ...rest } = item
    const rules = (Array.isArray(conf.rules) ? conf.rules : []).map((rule) => {
      const { backendRefs = [], filters = [] } = rule.default

      return {
        matches: rule.matches,
        default: {
          backendRefs,
          filters,
        },
      }
    })

    return {
      type: '',
      ruleType: 'to',
      ...rest,
      raw: conf,
      config: {
        ...conf,
        // An omitted or empty hostnames list implies the wildcard hostname (meaning any hostnames apply).
        hostnames: Array.isArray(conf.hostnames) && conf.hostnames.length > 0 ? conf.hostnames : ['*'],
        rules,
      },
      origins: Array.isArray(origin) ? origin : [],
      matchers: Array.isArray(matchers) ? matchers : [],
    }
  },
  fromCollection(partialInspectRules: PartialInspectRulesForDataplane): RuleCollection {
    const rules = Array.isArray(partialInspectRules.rules)
      ? partialInspectRules.rules.reduce<Rule[]>((prev, item) => {
      // to rules we can just reshape.
        const to: Rule[] = Array.isArray(item.toRules)
          ? item.toRules.map(rule => {
            return {
              ...Rule.fromObject(rule),
              ruleType: 'to',
              type: item.type,
            }
          })
          : []

        // from rules we can need to flatten out with reduce
        const from: Rule[] = Array.isArray(item.fromRules)
          ? item.fromRules.reduce<Rule[]>((prev, rule) => {
            const { rules, ...rest } = rule
            return prev.concat(rules.map(r => {
              return {
                ...rest,
                ...Rule.fromObject(r),
                ruleType: 'from',
                type: item.type,
              }
            }))
          }, [])
          : []

        // the proxyRule is only ever a single one, but we turn it into an array
        // with a single entry so it looks like to and from rules
        const proxy: Rule[] = typeof item.proxyRule !== 'undefined'
          ? [{
            ...Rule.fromObject(item.proxyRule as InspectBaseRule),
            ruleType: 'proxy',
            type: item.type,
          }]
          : []

        // concat all the rules now thay all look the same
        return prev.concat(to).concat(from).concat(proxy)
      }, [])
      : []
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
