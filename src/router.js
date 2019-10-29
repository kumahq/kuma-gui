import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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
      path: '/',
      name: 'overview',
      component: () => import('@/views/Overview')
    },
    {
      path: '/entities/services',
      name: 'services',
      component: () => import('@/views/Entities/EntityServices')
    },
    {
      path: '/entities/dataplanes',
      name: 'dataplanes',
      component: () => import('@/views/Entities/EntityDataplanes')
    },
    {
      path: '/policies/traffic-permissions',
      name: 'traffic-permissions',
      component: () => import('@/views/Policies/TrafficPermissions')
    },
    {
      path: '/policies/traffic-routes',
      name: 'traffic-routes',
      component: () => import('@/views/Policies/TrafficRoutes')
    },
    {
      path: '/policies/traffic-log',
      name: 'traffic-log',
      component: () => import('@/views/Policies/TrafficLog')
    },
    // dynamic routes
    {
      path: '/:mesh/overview',
      name: 'mesh-overview',
      component: () => import('@/views/Overview')
    },
    {
      path: '/:mesh/services',
      name: 'mesh-services',
      component: () => import('@/views/Entities/EntityServices')
    },
    {
      path: '/:mesh/services/:service',
      name: 'mesh-service-details',
      // this needs to be changed to a detail view
      component: () => import('@/views/Entities/EntityServices')
    },
    {
      path: '/:mesh/dataplanes',
      name: 'mesh-dataplanes',
      component: () => import('@/views/Entities/EntityDataplanes')
    },
    {
      path: '/:mesh/dataplanes/:dataplane',
      name: 'mesh-dataplane-details',
      // this needs to be changed to a detail view
      component: () => import('@/views/Entities/EntityDataplanes')
    }
  ]
})
