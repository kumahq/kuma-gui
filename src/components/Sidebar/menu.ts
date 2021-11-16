import { RawLocation } from 'vue-router'
import meshIcon from '@/assets/images/icon-service-mesh.svg'

type TODO = any
type KIconType = 'gearFilled'

export interface MenuNavItem {
  name: string
  link?: RawLocation
  subNav?: MenuNavItem[]
  title?: boolean
  nested?: boolean
  parent?: string
  pathFlip?: boolean
  insightsFieldAccessor?: string
}

export interface MenuItem {
  name: string
  icon?: KIconType
  link?: string
  iconCustom?: TODO
  subNav?: {
    items: MenuNavItem[]
  }
}

export interface MenuSection {
  position: string
  items: MenuItem[]
}

const menu: MenuSection[] = [
  {
    position: 'top',
    items: [
      {
        name: 'Service Mesh',
        iconCustom: meshIcon,
        link: 'home',
        subNav: {
          items: [
            {
              name: 'Overview',
              link: 'global-overview',
            },
            {
              name: 'Meshes',
              link: 'mesh-child',
              pathFlip: true,
              insightsFieldAccessor: 'global.meshes',
            },
            {
              name: 'Zones',
              title: true,
            },
            {
              name: 'Zone CPs',
              link: 'zones',
              insightsFieldAccessor: 'global.zones',
              // root: true
              // multicluster: true
            },
            {
              name: 'Zone Ingresses',
              link: 'zoneingresses',
              insightsFieldAccessor: 'global.zoneIngresses',
              // root: true
              // multicluster: true
            },
            {
              name: 'Services',
              title: true,
            },
            {
              name: 'Internal',
              link: 'internal-services',
              title: false,
              insightsFieldAccessor: 'mesh.services.internal',
            },
            {
              name: 'External',
              link: 'external-services',
              title: false,
              insightsFieldAccessor: 'mesh.services.external',
            },
            {
              name: 'Data plane proxies',
              title: true,
            },
            {
              name: 'All',
              link: 'dataplanes',
              title: false,
              insightsFieldAccessor: 'mesh.dataplanes.total',
            },
            {
              name: 'Standard',
              link: 'standard-dataplanes',
              title: false,
              nested: true,
              insightsFieldAccessor: 'mesh.dataplanes.standard',
            },
            {
              name: 'Gateway',
              link: 'gateway-dataplanes',
              title: false,
              nested: true,
              insightsFieldAccessor: 'mesh.dataplanes.gateway',
            },
            {
              name: 'Policies',
              title: true,
            },
            ...[
              {
                name: 'Circuit Breakers',
                link: 'circuit-breakers',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.CircuitBreaker',
              },
              {
                name: 'Fault Injections',
                link: 'fault-injections',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.FaultInjection',
              },
              {
                name: 'Health Checks',
                link: 'health-checks',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.HealthCheck',
              },
              {
                name: 'Proxy Templates',
                link: 'proxy-templates',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.ProxyTemplate',
              },
              {
                name: 'Traffic Logs',
                link: 'traffic-logs',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficLog',
              },
              {
                name: 'Traffic Permissions',
                link: 'traffic-permissions',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficPermission',
              },
              {
                name: 'Traffic Routes',
                link: 'traffic-routes',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficRoute',
              },
              {
                name: 'Traffic Traces',
                link: 'traffic-traces',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficTrace',
              },
              {
                name: 'Rate Limits',
                link: 'rate-limits',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.RateLimit',
              },
              {
                name: 'Retries',
                link: 'retries',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.Retry',
              },
              {
                name: 'Timeouts',
                link: 'timeouts',
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.Timeout',
              },
            ].sort((a, b) => (a.name < b.name ? -1 : 1)),
          ],
        },
      },
    ],
  },
  {
    position: 'bottom',
    items: [
      {
        name: 'Diagnostics',
        icon: 'gearFilled',
        link: 'diagnostics',
      },
    ],
  },
]

export default menu
