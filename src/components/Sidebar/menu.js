export default {

  sections: [
    {
      name: 'General',
      id: 'general',
      skipRbac: true,
      items: [
        {
          name: 'Overview',
          link: '/overview',
          title: false
        }
      ]
    },
    {
      name: 'Entities',
      id: 'entities',
      skipRbac: true,
      items: [
        {
          name: 'Services',
          link: '/services',
          title: false
        },
        {
          name: 'Dataplanes',
          link: '/dataplanes',
          title: false
        }
      ]
    },
    {
      name: 'Policies',
      id: 'policies',
      skipRbac: true,
      items: [
        {
          name: 'Traffic Permissions',
          link: '/traffic-permissions',
          title: false
        },
        {
          name: 'Traffic Routes',
          link: '/traffic-routes',
          title: false
        },
        {
          name: 'Traffic Log',
          link: '/traffic-log',
          title: false
        }
      ]
    }
  ]
}
