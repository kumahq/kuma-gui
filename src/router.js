import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const DEFAULT_WORKSPACE = 'all'

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/404',
      name: 'not-found',
      alias: '*',
      meta: { title: 'Page not found' },
      component: () => import('@/views/NotFound')
    },
    {
      // endpoint: /meshes/{name}/
      path: '/:mesh/overview',
      name: 'overview',
      meta: { title: 'Global Overview' },
      component: () => import('@/views/GlobalOverview')
    },
    {
      // endpoint: /meshes/{name}/dataplanes
      path: '/:mesh/dataplanes',
      name: 'mesh-dataplanes',
      component: () => import('@/views/Entities/EntityDataplanes'),
      children: [
        {
          // endpoint: /meshes/{name}/dataplanes/{name}
          path: ':dataplane',
          name: 'mesh-dataplane-details',
          meta: {
            title: 'Dataplane Details'
          },
          component: () => import('@/views/Entities/EntityDataplanesDetail')
        }
      ]
    },
    {
      // endpoint: ??????
      path: '/:mesh/services',
      name: 'services',
      component: () => import('@/views/Entities/EntityServices'),
      children: [
        {
          path: ':service',
          name: 'service-details',
          meta: {
            title: 'Service Details'
          },
          component: () => import('@/views/Entities/EntityServicesDetail')
        }
      ]
    }
  ]
})
