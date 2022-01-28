type TODO = any

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

export interface Dataplane {
  networking: {
    inbound: {
      port: number
      tags: Record<string, string>
      health?: { ready: boolean }
    }[]
    gateway: TODO
  }
}

export interface DiscoveryServiceStats {
  responsesSent?: number
  responsesAcknowledged?: number
  responsesRejected?: number
}

export interface KumaDpVersion {
  version: string
  gitTag: string
  gitCommit: string
  buildDate: string
}

export interface EnvoyVersion {
  version: string
  build: string
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

export interface DataplaneInsight {
  mTLS?: {
    certificateExpirationTime: string
    lastCertificateRegeneration: string
    certificateRegenerations: number
    issuedBackend: string
    supportedBackends: string[]
  }
  subscriptions: DiscoverySubscription[]
}

export interface DataplaneOverview {
  name: string
  mesh: string
  type: string
  dataplane: Dataplane
  dataplaneInsight: DataplaneInsight
}

export interface LabelValue {
  label: string
  value: string
}
