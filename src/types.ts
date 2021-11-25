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

export interface MeshInsight {
  type: 'MeshInsight'
  name: string
  creationTime: string
  modificationTime: string
  lastSync: string
  dataplanes: UnitStatus
  dataplanesByType: Record<string, UnitStatus>
  policies: Record<string, UnitStatus>
  dpVersions: Record<string, Record<string, UnitStatus>>
  mTLS: {
    issuedBackends?: Record<string, UnitStatus>
    supportedBackends?: Record<string, UnitStatus>
  }
  services: Record<string, number>
}
