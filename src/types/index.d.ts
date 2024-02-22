/**
 * Creates an “unsaved” variant of a resource type which is missing the fields that are only present on an object once its saved in the database.
 */
export type Unsaved<RT> = Omit<RT, 'creationTime' | 'modificationTime'>

export type StatusKeyword = 'online' | 'offline' | 'partially_degraded' | 'not_available'

export type Tags = Record<string, string>

export type ServiceTags = Tags & Record<'kuma.io/service', string>

export interface DiscoveryServiceStats {
  responsesSent?: string
  responsesAcknowledged?: string
  responsesRejected?: string
}

export interface KDSSubscriptionStatus {
  lastUpdateTime: string
  total: DiscoveryServiceStats
  stat: Record<string, DiscoveryServiceStats>
}

export interface KDSSubscription {
  config: string
  id: string
  globalInstanceId: string
  connectTime: string
  disconnectTime?: string
  status: KDSSubscriptionStatus
  version: any
}

export interface ZoneInsight {
  subscriptions: KDSSubscription[]
}

export interface DataPlaneProxyStatus {
  total?: number
  online?: number
  offline?: number
  partiallyDegraded?: number
}

export interface ServiceStatus {
  total?: number
  internal?: number
  external?: number
}

export interface ResourceStat {
  total: number
}

export interface GlobalInsightDataPlaneProxies {
  gatewayBuiltin: {
    total: number
    online: number
    partiallyDegraded: number
    offline: number
  }
  gatewayDelegated: {
    total: number
    online: number
    partiallyDegraded: number
    offline: number
  }
  standard: {
    total: number
    online: number
    partiallyDegraded: number
    offline: number
  }
}

export interface GlobalInsightMeshes {
  total: number
}

export interface GlobalInsightPolicies {
  total: number
}

export interface GlobalInsightServices {
  external: {
    total: number
  }
  gatewayBuiltin: {
    total: number
    online: number
    partiallyDegraded: number
    offline: number
  }
  gatewayDelegated: {
    total: number
    online: number
    partiallyDegraded: number
    offline: number
  }
  internal: {
    total: number
    online: number
    partiallyDegraded: number
    offline: number
  }
}

export interface GlobalInsightZones {
  controlPlanes: {
    total: number
    online: number
  }
  zoneEgresses: {
    total: number
    online: number
  }
  zoneIngresses: {
    total: number
    online: number
  }
}

export interface GlobalInsight {
  dataplanes: GlobalInsightDataPlaneProxies
  meshes: GlobalInsightMeshes
  policies: GlobalInsightPolicies
  services: GlobalInsightServices
  zones: GlobalInsightZones
}

export interface KumaDpVersion {
  version: string
  gitTag: string
  gitCommit: string
  buildDate: string
  kumaCpCompatible?: boolean
}

export interface EnvoyVersion {
  version: string
  build: string
  kumaDpCompatible?: boolean
}

export interface DiscoverySubscriptionStatus {
  lastUpdateTime: string
  total: DiscoveryServiceStats
  cds: DiscoveryServiceStats
  eds: DiscoveryServiceStats
  lds: DiscoveryServiceStats
  rds: DiscoveryServiceStats
}

export interface Version {
  kumaDp: KumaDpVersion

  envoy: EnvoyVersion

  dependencies: Record<string, string>
}

export interface DiscoverySubscription {
  id: string
  controlPlaneInstanceId: string
  connectTime?: string
  disconnectTime?: string
  status: DiscoverySubscriptionStatus
  generation?: number
  version?: Version
}

export interface DataPlaneInsight {
  mTLS?: {
    certificateExpirationTime: string
    lastCertificateRegeneration: string
    certificateRegenerations: number
    issuedBackend: string
    supportedBackends: string[]
  }
  subscriptions: DiscoverySubscription[]
}

export type DataplaneGateway = {
  tags: ServiceTags
  /**
   * Type of the gateway. **Default**: `'DELEGATED'`
   */
  type?: 'BUILTIN' | 'DELEGATED'
}

export type DataplaneWarning = {
  kind: string
  payload?: {
    kumaDp: string
    envoy?: string
  }
}

export type DataplaneInbound = {
  address?: string
  port: number
  servicePort?: number
  serviceAddress?: string
  tags: ServiceTags
  health?: {
    ready: boolean
  }
}

export type DataplaneOutbound = {
  port: number
  tags: ServiceTags
}

export type DataplaneNetworking = {
  address: string
  advertisedAddress?: string
  inbound?: DataplaneInbound[]
  outbound?: DataplaneOutbound[]
  /**
   * The presence of the `gateway` field means the resource is a gateway. The `gateway.type` property indicates which type of gateway it is.
   *
   * The absence of the `gateway` field means the resource is a regular Data Plane Proxy.
   */
  gateway?: DataplaneGateway
}

/**
 * A policy definition as returned via the `/policies` endpoint.
 */
export type PolicyType = {
  /**
   * The policy type’s name (e.g. “CircuitBreaker”).
   */
  name: string

  /**
   * The associated API path for the policy. Used to look up all set-up policies and policies for specific meshes.
   */
  path: string

  /**
   * Controls whether to display a warning alert letting users know that this policy is experimental.
   */
  isExperimental: boolean

  readOnly: boolean

  /**
   * Whether the policy type is based on target refs (e.g. its policies have a top-level target ref, etc.).
   */
  isTargetRefBased: boolean
  isInbound: boolean
  isOutbound: boolean
}

export type DataPlaneStatus = 'Online' | 'Offline' | 'Partially degraded'

export type ZoneCompatibility = {
  kind: 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS'
  payload?: {
    zoneCpVersion: string
    globalCpVersion: string
  }
}

export interface LabelValue {
  label: string
  value: string
}

export interface Entity {
  type: string
  name: string
  creationTime: string
  modificationTime: string
}

export interface MeshEntity extends Entity {
  mesh: string
}

/**
 * Entity as returned via the `/meshes/:mesh/dataplanes/:dataPlane` endpoint.
 */
export interface DataPlane extends MeshEntity {
  type: 'Dataplane'
  networking: DataplaneNetworking
}

/**
 * Overview entity as returned via the `/meshes/:mesh/dataplanes/:dataPlane/_overview` endpoint.
 */
export interface DataPlaneOverview extends MeshEntity {
  type: 'DataplaneOverview'
  dataplane: {
    networking: DataplaneNetworking
  }
  dataplaneInsight?: DataPlaneInsight
}

export interface DataplaneRule {
  type: 'ClientSubset' | 'DestinationSubset' | 'SingleItem'
  name: string
  service?: string
  addresses?: string[]
  policyType: string
  subset?: Record<string, string>
  tags?: Record<string, string>
  conf: Record<string, unknown>
  origins: Array<{ mesh: string, name: string }>
}

export interface Meta<Type extends string = string> {
  type: Type
  mesh: string
  name: string
}

export type Conf = Record<string, unknown>

export interface InspectRuleMatcher {
  key: string
  value: string
  not: boolean
}

export interface InspectBaseRule {
  matchers: InspectRuleMatcher[]
  conf: Conf
  origin: Meta[]
}

export interface InspectProxyRule {
  conf: Conf
  origin: Meta[]
}

export interface InspectInbound {
  tags: Record<string, string>
  port: number
}

export interface InspectFromRule {
  inbound: InspectInbound
  rules: InspectBaseRule[]
}

export interface InspectRule {
  /**
   * Policy type
   */
  type: string
  proxyRule?: InspectProxyRule
  toRules?: InspectBaseRule[]
  fromRules?: InspectFromRule[]
  warnings?: string[]
}

export interface InspectRulesForDataplane {
  resource: Meta<'Dataplane'>
  rules: InspectRule[]
}

export type PolicyMatch = {
  match: ServiceTags
}

export interface MatchedPolicyType extends MeshEntity {
  sources?: PolicyMatch[]
  destinations?: PolicyMatch[]
  selectors?: Array<{ match: Record<string, string> }>
  conf?: any
}

export interface SidecarDataplane {
  type: 'inbound' | 'outbound' | 'service' | 'dataplane'
  service: string
  name: string
  matchedPolicies: Record<string, MatchedPolicyType[]>
}

export type MeshGatewayDataplaneDestination = {
  tags: {
    'kuma.io/service': string
  }
  policies: Record<string, MatchedPolicyType>
}

export type MeshGatewayDataplaneRoute = {
  route: string
  destinations: MeshGatewayDataplaneDestination[]
}

export type MeshGatewayDataplaneHost = {
  hostName: string
  routes: MeshGatewayDataplaneRoute[]
}

export type MeshGatewayDataplaneListener = {
  port: number
  protocol: string
  hosts: MeshGatewayDataplaneHost[]
}

export interface MeshGatewayDataplane {
  kind: 'MeshGatewayDataplane'
  gateway: {
    mesh: string
    name: string
  }
  listeners: MeshGatewayDataplaneListener[] | null
  policies?: Record<string, MatchedPolicyType>
}

export type PolicyTypeEntryConnection = {
  sourceTags: LabelValue[]
  destinationTags: LabelValue[]
  name: string | null
  origins: Meta[]
  config: string | undefined
}

export type PolicyTypeEntry = {
  type: string
  connections: PolicyTypeEntryConnection[]
}

export type RuleEntryRule = {
  config: object | undefined
  matchers?: InspectRuleMatcher[]
  origins: Meta[]
}

export type RuleEntry = {
  type: string
  rules: RuleEntryRule[]
}

export type MeshGatewayRouteEntry = {
  route: Meta
  service: string
  origins: Meta[]
}

export type MeshGatewayListenerEntry = {
  protocol: string
  port: number
  hostName: string
  routeEntries: MeshGatewayRouteEntry[]
}

/**
 * Entity as returned via the `/meshes/:mesh/service-insights/:service` endpoint.
 */
export interface ServiceInsight extends MeshEntity {
  type: 'ServiceInsight'
  serviceType?: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated'
  addressPort?: string
  status?: StatusKeyword
  dataplanes?: {
    total?: number
    online?: number
    offline?: number
  }
}

type ByteDataSource = {
  secret?: string
  file?: string
  inline?: string
  inlineString?: string
}

export interface ExternalService extends MeshEntity {
  type: 'ExternalService'
  networking: {
    address: string
    tls?: {
      enabled: boolean
      caCert?: ByteDataSource
      clientCert?: ByteDataSource
      clientKey?: ByteDataSource
      allowRenegotiation: boolean
      serverName?: string
      skipHostnameVerification?: boolean
    }
    disableHostDNSEntry?: boolean
  }
  tags: ServiceTags
}

export interface Zone {
  name: string
  enabled?: boolean
}

/**
 * Overview entity as returned via the `/zones/:zone/_overview` endpoint.
 */
export interface ZoneOverview extends MeshEntity {
  type: 'ZoneOverview'
  zone: Zone
  zoneInsight?: ZoneInsight
}

export interface ZoneIngressNetworking {
  address?: string
  advertisedAddress?: string
  port?: string
  advertisedPort?: string
}

export interface AvailableService {
  tags: Record<'kuma.io/service', string> & Record<string, string | undefined>
  instances?: number
  mesh?: string
  externalService?: boolean
}

export interface ZoneIngress extends MeshEntity {
  zone?: string
  networking?: ZoneIngressNetworking
  availableServices?: AvailableService[]
}

export interface ZoneIngressInsight {
  subscriptions: DiscoverySubscription[]
}

export interface ZoneIngressOverview extends MeshEntity {
  type: 'ZoneIngressOverview'
  zoneIngress: {
    zone?: string
    networking?: ZoneIngressNetworking
    availableServices?: AvailableService[]
  }
  zoneIngressInsight?: ZoneIngressInsight
}

export interface ZoneEgressNetworking {
  address?: string
  port?: string
}

export interface ZoneEgress extends MeshEntity {
  zone?: string
  networking?: ZoneEgressNetworking
}
export interface ZoneEgressInsight {
  subscriptions: DiscoverySubscription[]
}

export interface ZoneEgressOverview extends MeshEntity {
  type: 'ZoneEgressOverview'
  zoneEgress: {
    zone?: string
    networking?: ZoneEgressNetworking
  }
  zoneEgressInsight?: ZoneEgressInsight
}

export interface DpCert {
  rotation?: {
    expiration?: string
  }
  requestTimeout?: string
}

export interface Backend {
  name: string
  type: string
  conf?: Conf
  dpCert?: DpCert
}

export interface MeshBackend {
  enabledBackend?: string
  defaultBackend?: string
  backends?: Backend[]
}

/**
 * Entity as returned via the `/meshes/:mesh` endpoint.
 */
export interface Mesh extends Entity {
  type: 'Mesh'
  mtls?: MeshBackend
  logging?: MeshBackend
  tracing?: MeshBackend
  metrics?: MeshBackend
  routing?: {
    localityAwareLoadBalancing?: boolean
    zoneEgress?: boolean
  }
}

export type DpVersions = {
  kumaDp: Record<string, DataPlaneProxyStatus>
  envoy: Record<string, DataPlaneProxyStatus>
}

/**
 * Overview entity as returned via the `/meshes-insights/:mesh` endpoint.
 */
export interface MeshInsight extends Entity {
  type: 'MeshInsight'
  lastSync: string
  dataplanes: DataPlaneProxyStatus
  dataplanesByType: {
    standard: DataPlaneProxyStatus
    gateway: DataPlaneProxyStatus
    gatewayBuiltin: DataPlaneProxyStatus
    gatewayDelegated: DataPlaneProxyStatus
  }
  policies?: Record<string, ResourceStat>
  dpVersions: DpVersions
  mTLS: {
    issuedBackends?: Record<string, DataPlaneProxyStatus>
    supportedBackends?: Record<string, DataPlaneProxyStatus>
  }
  services: ServiceStatus
}

export interface PolicyEntity extends MeshEntity {
  labels?: {
    'kuma.io/origin'?: string
    'kuma.io/zone'?: string
  }
  spec?: {
    // https://kuma.io/docs/2.4.x/policies/targetref/
    targetRef?: {
      name?: string
      kind: string
    }
  }
}

export interface MeshGatewaySelector {
  match: ServiceTags
}

export interface TlsConfDataSource {
  secret?: string
  file?: string
  inline?: string
  inlineString?: string
}

export interface TlsConfOptions {}

export interface MeshGatewayTlsConf {
  mode?: 'TERMINATE' | 'PASSTHROUGH'
  certificates?: TlsConfDataSource[]
  options?: TlsConfOptions
}

export interface MeshGatewayListenerResources {
  connection_limit?: number
}

export interface MeshGatewayListener {
  hostname?: string
  port?: number
  protocol?: 'TCP' | 'TLS' | 'HTTP' | 'HTTPS'
  tls?: MeshGatewayTlsConf
  tags?: Tags
  crossMesh?: boolean
  resources?: MeshGatewayListenerResources
}

export interface MeshGateway extends MeshEntity {
  type: 'MeshGateway'
  labels?: Tags
  selectors?: MeshGatewaySelector[]
  tags?: Tags
  conf?: {
    listeners?: MeshGatewayListener[]
  }
}

export interface PolicyDataplane {
  type: 'Dataplane'
  mesh: string
  name: string
}
