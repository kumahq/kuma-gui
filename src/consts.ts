export const PRODUCT_NAME = process.env.VUE_APP_NAMESPACE
export const PAGE_SIZE_DEFAULT = 12
export const PAGE_REQUEST_SIZE_DEFAULT = 500
export const APP_WINDOW = window

export const ONLINE = 'Online'
export const OFFLINE = 'Offline'
export const PARTIALLY_DEGRADED = 'Partially degraded'

export const DISABLED = 'Disabled'

export const KUMA_ZONE_TAG_NAME = 'kuma.io/zone'

export const POLICY_MAP = {
  CircuitBreaker: {
    title: 'Circuit Breakers',
    route: 'circuit-breakers',
  },
  FaultInjection: {
    title: 'Fault Injections',
    route: 'fault-injections',
  },
  HealthCheck: {
    title: 'Health Checks',
    route: 'health-checks',
  },
  ProxyTemplate: {
    title: 'Proxy Templates',
    route: 'proxy-templates',
  },
  TrafficLog: {
    title: 'Traffic Logs',
    route: 'traffic-logs',
  },
  TrafficPermission: {
    title: 'Traffic Permissions',
    route: 'traffic-permissions',
  },
  TrafficRoute: {
    title: 'Traffic Routes',
    route: 'traffic-routes',
  },
  TrafficTrace: {
    title: 'Traffic Traces',
    route: 'traffic-traces',
  },
  RateLimit: {
    title: 'Rate Limits',
    route: 'rate-limits',
  },
  Retry: {
    title: 'Retries',
    route: 'retries',
  },
  Timeout: {
    title: 'Timeouts',
    route: 'timeouts',
  },
  MeshGateway: {
    title: 'Mesh Gateways',
    route: 'mesh-gateways',
  },
  MeshGatewayRoute: {
    title: 'Mesh Gateway Routes',
    route: 'mesh-gateway-routes',
  },
}

export const FEATURE_FLAG = {}
