export type TODO = any

export interface KDSSubscription {
  config: string
  id: string
  globalInstanceId: string
  connectTime: string
  disconnectTime?: string
  status: any
  version: any
}

export interface Zone {
  type: 'Zone'
  name: string
  creationTime: string
  modificationTime: string
  enabled: boolean
}

export interface ZoneInsight {
  subscriptions: KDSSubscription[]
}

export interface ZoneOverview {
  type: 'ZoneOverview'
  mesh: string
  name: string
  creationTime: string
  modificationTime: string
  zone: Zone
  zoneInsight: ZoneInsight
}

export interface ResourceResponse<T = {}> {
  total: number
  items: T[]
  next: boolean | null
}

export interface AllResourceResponse<T = {}> {
  items: T[]
  total: number
}

export interface Mesh {
  creationTime: string
  modificationTime: string
  name: string
  type: 'Mesh'
  mtls?: Object
  logging?: Object
  tracing?: Object
  metrics?: Object
}

export interface UnitStatus {
  total?: number
  online?: number
  offline?: number
  partiallyDegraded?: number
}

export interface ResourceStat {
  total: number
}

export interface MeshInsight {
  type: 'MeshInsight'
  name: string
  creationTime: string
  modificationTime: string
  lastSync: string
  dataplanes: UnitStatus
  dataplanesByType: Record<string, UnitStatus>
  policies: Record<string, ResourceStat>
  dpVersions: Record<string, Record<string, UnitStatus>>
  mTLS: {
    issuedBackends?: Record<string, UnitStatus>
    supportedBackends?: Record<string, UnitStatus>
  }
  services: Record<string, number>
}

export interface GlobalInsights {
  type: 'GlobalInsights'
  creationTime: string
  resources: Record<string, ResourceStat>
}

export interface DiscoveryServiceStats {
  responsesSent?: string
  responsesAcknowledged?: string
  responsesRejected?: string
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
  version: Version
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

export type DataPlaneNetworking = {
  address: string
  inbound?: {
    port: number
    servicePort: number
    serviceAddress: string
    tags: Record<string, string>
    health?: {
      ready: boolean
    }
  }[]
  outbound?: {
    port: number
    tags: Record<string, string>
  }[]
  gateway?: {
    tags: Record<string, string>
    type?: 'builtin' | 'provided' | undefined
  },
}

export interface DataPlane {
  type: 'Dataplane'
  name: string
  mesh: string
  creationTime: string
  modificationTime: string
  networking: DataPlaneNetworking
}

export interface DataPlaneOverview {
  type: 'DataplaneOverview'
  name: string
  mesh: string
  creationTime: string
  modificationTime: string
  dataplane: {
    networking: DataPlaneNetworking
  }
  dataplaneInsight: DataPlaneInsight
}

export interface LabelValue {
  label: string
  value: string
}

/**
 * An available policy as returned via the `/policies` endpoint.
 */
export type Policy = {
  /**
   * The policies internal name (e.g. “CircuitBreaker”).
   */
  name: string

  /**
   * The policies display name. In plural form (e.g. “Circuit Breakers”); a singular form is also provided.
   */
  pluralDisplayName: string
  singularDisplayName: string

  /**
   * The associated API path for the policy. Used to look up all set-up policies and policies for specific meshes.
   */
  path: string

  /**
   * Controls whether to display a warning alert letting users know that this policy is experimental.
   */
  isExperimental: boolean

  readOnly: boolean
}

export type DataPlaneStatus = 'Online' | 'Offline' | 'Partially degraded'

export type DataPlaneEntityMtls = {
  certificateExpirationTime: {
    label: 'Expiration Time'
    value: string
  }
  lastCertificateRegeneration: {
    label: 'Last Generated'
    value: string
  }
  certificateRegenerations: {
    label: 'Regenerations'
    value: number
  }
}

export type Compatibility = {
  kind: 'COMPATIBLE' | 'INCOMPATIBLE_UNSUPPORTED_KUMA_DP' | 'INCOMPATIBLE_UNSUPPORTED_ENVOY' | 'INCOMPATIBLE_WRONG_FORMAT' | 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS'
  payload?: {
    kumaDp: string
    envoy?: string
  }
}
