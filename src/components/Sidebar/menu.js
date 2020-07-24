export default {

  sections: [
    {
      name: 'Global',
      id: 'global',
      skipRbac: true,
      items: [
        {
          name: 'Overview',
          link: '/overview',
          title: false
        },
        {
          name: 'Zones',
          link: '/zones',
          title: false
          // multicluster: true
        },
        {
          name: 'Meshes',
          link: '/meshes',
          title: false,
          pathFlip: true
        }
      ]
    },
    {
      name: 'Dataplane Types',
      id: 'dataplanes',
      skipRbac: true,
      items: [
        {
          name: 'Dataplanes',
          title: true
        },
        {
          name: 'All Dataplanes',
          link: '/dataplanes',
          title: false
        },
        {
          name: 'Ingress',
          link: '/ingress-dataplanes',
          title: false,
          nested: true
        },
        {
          name: 'Gateway',
          link: '/gateway-dataplanes',
          title: false,
          nested: true
        }
      ]
    },
    {
      name: 'Policies',
      id: 'policies',
      skipRbac: true,
      items: [
        {
          name: 'Policies',
          title: true
        },
        {
          name: 'Circuit Breakers',
          link: '/circuit-breakers',
          title: false,
          parent: 'policies'
        },
        {
          name: 'Fault Injections',
          link: '/fault-injections',
          title: false,
          parent: 'policies'
        },
        {
          name: 'Health Checks',
          link: '/health-checks',
          title: false,
          parent: 'policies'
        },
        {
          name: 'Proxy Templates',
          link: '/proxy-templates',
          title: false,
          parent: 'policies'
        },
        {
          name: 'Traffic Logs',
          link: '/traffic-logs',
          title: false,
          parent: 'policies'
        },
        {
          name: 'Traffic Permissions',
          link: '/traffic-permissions',
          title: false,
          parent: 'policies'
        },
        {
          name: 'Traffic Routes',
          link: '/traffic-routes',
          title: false,
          parent: 'policies'
        },
        {
          name: 'Traffic Traces',
          link: '/traffic-traces',
          title: false,
          parent: 'policies'
        }
      ]
    }
  ]
}
