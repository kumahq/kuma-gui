import { RawLocation } from 'vue-router'
import meshIcon from '@/assets/images/icon-service-mesh.svg'

type TODO = any
type KIconType = 'gearFilled'

export interface MenuNavItem {
  name: string,
  link?: RawLocation,
  subNav?: MenuNavItem[],
  title?: boolean,
  nested?: boolean,
  parent?: string,
  pathFlip?: boolean,
}

export interface MenuItem {
  name: string
  icon?: KIconType
  link?: string,
  iconCustom?: TODO,
  subNav?: {
    items: MenuNavItem[]
  },
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
              link: 'global-overview'
            },
            {
              name: 'Zones',
              link: 'zones'
              // root: true
              // multicluster: true
            },
            {
              name: 'Zone Ingresses',
              link: 'zoneingresses'
              // root: true
              // multicluster: true
            },
            {
              name: 'Meshes',
              link: 'mesh-child',
              pathFlip: true
            },
            {
              name: 'Services',
              title: true
            },
            {
              name: 'Internal',
              link: 'internal-services',
              title: false,
              nested: true
            },
            {
              name: 'External',
              link: 'external-services',
              title: false,
              nested: true
            },
            {
              name: 'Data plane proxies',
              title: true
            },
            {
              name: 'All',
              link: 'dataplanes',
              title: false
            },
            {
              name: 'Standard',
              link: 'standard-dataplanes',
              title: false,
              nested: true
            },
            {
              name: 'Gateway',
              link: 'gateway-dataplanes',
              title: false,
              nested: true
            },
            {
              name: 'Policies',
              title: true
            },
            ...[{
              name: 'Circuit Breakers',
              link: 'circuit-breakers',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Fault Injections',
              link: 'fault-injections',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Health Checks',
              link: 'health-checks',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Proxy Templates',
              link: 'proxy-templates',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Traffic Logs',
              link: 'traffic-logs',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Traffic Permissions',
              link: 'traffic-permissions',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Traffic Routes',
              link: 'traffic-routes',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Traffic Traces',
              link: 'traffic-traces',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Rate Limits',
              link: 'rate-limits',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Retries',
              link: 'retries',
              title: false,
              parent: 'policies'
            },
            {
              name: 'Timeouts',
              link: 'timeouts',
              title: false,
              parent: 'policies'
            }].sort((a, b) => a.name < b.name ? -1 : 1)
          ]
        }
      }
    ]
  },
  {
    position: 'bottom',
    items: [
      {
        name: 'Diagnostics',
        icon: 'gearFilled',
        link: 'diagnostics'
      }
    ]
  }
]

export default menu
