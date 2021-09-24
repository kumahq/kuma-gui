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
  ingress: {
    address: string
  }
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
  data: T[]
  total: number
}
