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
        }
      ]
    },
    {
      name: 'General',
      id: 'general',
      skipRbac: true,
      items: [
        {
          name: 'General',
          title: true
        },
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
          name: 'Entities',
          title: true
        },
        // {
        //   name: 'Services',
        //   link: '/services',
        //   title: false
        // },
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
          name: 'Policies',
          title: true
        },
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
