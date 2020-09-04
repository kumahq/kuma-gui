const config = (options = {
  mockData: false
}) => ({
  name: 'service-map',
  sidebar: [
    {
      name: 'service-map',
      id: 'service-map',
      items: [
        {
          name: 'Service Map',
          link: '/service-map/',
          parent: 'service-map'
        }
      ]
    }
  ],

  rootRoutes: [
    {
      path: '/:mesh?/service-map',
      name: 'service-map',
      meta: { title: 'Service Map' },
      params: { mesh: ':mesh' },
      component: () => import('./pages/Shell.vue')
    }
  ],

  apiEndpoints: {

  },

  mockEndpoints () {

  }
})
