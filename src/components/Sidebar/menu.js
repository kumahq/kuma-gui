export default {

  sections: [
    {
      name: 'Global',
      id: 'global',
      skipRbac: true,
      items: [
        {
          name: 'Global Overview',
          link: '/overview',
          title: false,
          root: true
        },
        {
          name: 'Mesh Overview',
          link: '/overview',
          title: false
        },
        {
          name: 'Meshes',
          link: '/meshes',
          title: false,
          root: true
        },
        {
          name: 'Dataplanes',
          link: '/dataplanes',
          title: false
          // root: true
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
