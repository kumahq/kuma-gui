import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/404',
    name: 'not-found',
    alias: '*',
    meta: { title: 'Page not found' },
    component: () => import('@/views/NotFound')
  },
  {
    path: '/',
    redirect: { name: 'global-overview' }
  },
  {
    path: '/overview',
    name: 'global-overview',
    meta: {
      title: 'Global Overview',
      excludeAsBreadcrumb: true,
      parent: 'global-overview'
    },
    component: () => import('@/views/Overview')
  },
  {
    path: '/:mesh',
    redirect: { name: 'mesh-overview' },
    name: 'mesh',
    meta: {
      title: 'Overview'
    },
    params: { mesh: ':mesh' },
    component: () => import('@/views/Shell'),
    children: [
      {
        path: 'overview',
        name: 'mesh-overview',
        meta: {
          title: 'Overview',
          breadcrumb: 'Overview',
          parent: 'global-overview'
        },
        component: () => import('@/views/Entities/EntityOverview')
      },
      {
        path: 'dataplanes',
        name: 'dataplanes',
        meta: {
          title: 'Dataplanes',
          breadcrumb: 'Dataplanes',
          parent: 'global-overview'
        },
        component: () => import('@/views/Entities/EntityDataplanes')
      },
      {
        path: 'dataplanes/:dataplane',
        name: 'dataplane-details',
        meta: {
          title: 'Dataplane Details',
          breadcrumb: ':dataplane',
          parent: 'dataplanes'
        },
        params: { dataplane: ':dataplane' },
        component: () => import('@/views/Entities/EntityDataplanesDetail')
      },
      {
        path: 'services',
        name: 'services',
        meta: { title: 'Services' },
        component: () => import('@/views/Entities/EntityServices')
      },
      {
        path: 'services/:service',
        name: 'service-details',
        params: { service: ':service' },
        component: () => import('@/views/Entities/EntityServicesDetail')
      },
      {
        path: 'traffic-permissions',
        name: 'traffic-permissions',
        meta: { title: 'Traffic Permissions' },
        component: () => import('@/views/Policies/TrafficPermissions')
        // child routes?
      },
      {
        path: 'traffic-routes',
        name: 'traffic-routes',
        meta: { title: 'Traffic Routes' },
        component: () => import('@/views/Policies/TrafficRoutes')
        // child routes?
      },
      {
        path: 'traffic-log',
        name: 'traffic-log',
        meta: { title: 'Traffic Logs' },
        component: () => import('@/views/Policies/TrafficLog')
        // child routes?
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
