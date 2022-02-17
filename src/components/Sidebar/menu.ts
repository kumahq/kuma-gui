import { RawLocation } from 'vue-router'
import meshIcon from '@/assets/images/icon-service-mesh.svg'
import { POLICY_MAP, FEATURE_FLAG } from '@/consts'

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
  featureFlags?: string[]
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
              insightsFieldAccessor: 'global.Mesh',
            },
            {
              name: 'Zones',
              title: true,
            },
            {
              name: 'Zone CPs',
              link: 'zones',
              insightsFieldAccessor: 'global.Zone',
            },
            {
              name: 'Zone Ingresses',
              link: 'zoneingresses',
              insightsFieldAccessor: 'global.ZoneEgress',
            },
            {
              name: 'Zone Egresses',
              link: 'zoneegresses',
              insightsFieldAccessor: 'global.ZoneIngress',
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
                name: POLICY_MAP.CircuitBreaker.title,
                link: POLICY_MAP.CircuitBreaker.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.CircuitBreaker',
              },
              {
                name: POLICY_MAP.FaultInjection.title,
                link: POLICY_MAP.FaultInjection.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.FaultInjection',
              },
              {
                name: POLICY_MAP.HealthCheck.title,
                link: POLICY_MAP.HealthCheck.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.HealthCheck',
              },
              {
                name: POLICY_MAP.ProxyTemplate.title,
                link: POLICY_MAP.ProxyTemplate.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.ProxyTemplate',
              },
              {
                name: POLICY_MAP.TrafficLog.title,
                link: POLICY_MAP.TrafficLog.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficLog',
              },
              {
                name: POLICY_MAP.TrafficPermission.title,
                link: POLICY_MAP.TrafficPermission.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficPermission',
              },
              {
                name: POLICY_MAP.TrafficRoute.title,
                link: POLICY_MAP.TrafficRoute.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficRoute',
              },
              {
                name: POLICY_MAP.TrafficTrace.title,
                link: POLICY_MAP.TrafficTrace.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.TrafficTrace',
              },
              {
                name: POLICY_MAP.RateLimit.title,
                link: POLICY_MAP.RateLimit.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.RateLimit',
              },
              {
                name: POLICY_MAP.Retry.title,
                link: POLICY_MAP.Retry.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.Retry',
              },
              {
                name: POLICY_MAP.Timeout.title,
                link: POLICY_MAP.Timeout.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.Timeout',
              },
              {
                name: POLICY_MAP.MeshGateway.title,
                link: POLICY_MAP.MeshGateway.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.MeshGateway',
                featureFlags: [FEATURE_FLAG.GATEWAY],
              },
              {
                name: POLICY_MAP.MeshGatewayRoute.title,
                link: POLICY_MAP.MeshGatewayRoute.route,
                title: false,
                parent: 'policies',
                insightsFieldAccessor: 'mesh.policies.MeshGatewayRoute',
                featureFlags: [FEATURE_FLAG.GATEWAY],
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
