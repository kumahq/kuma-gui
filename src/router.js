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
    redirect: {
      name: 'overview'
    }
  },
  {
    path: '/overview',
    name: 'overview',
    meta: { title: 'Global Overview' },
    component: () => import('@/views/Overview/GlobalOverview')
  },
  {
    path: '/:mesh',
    name: 'mesh',
    meta: { title: 'mesh' },
    params: { mesh: ':mesh' },
    component: () => import('@/views/Shell'),
    children: [
      {
        path: 'overview',
        name: 'mesh-overview',
        meta: { title: 'Global Overview' },
        component: () => import('@/views/Overview/GlobalOverview')
      },
      {
        path: 'dataplanes',
        name: 'dataplanes',
        meta: { title: 'Dataplanes' },
        component: () => import('@/views/Entities/EntityDataplanes'),
        children: [
          {
            path: ':dataplane',
            name: 'dataplane-details',
            params: { dataplane: ':dataplane' },
            component: () => import('@/views/Entities/EntityDataplanesDetail')
          }
        ]
      },
      {
        path: 'services',
        name: 'services',
        meta: { title: 'Services' },
        component: () => import('@/views/Entities/EntityServices'),
        children: [
          {
            path: ':service',
            name: 'service-details',
            params: { service: ':service' },
            component: () => import('@/views/Entities/EntityServicesDetail')
          }
        ]
      },
      {
        path: 'traffic-permissions',
        name: 'traffic-permissions',
        meta: { title: 'Traffic Permissions' },
        component: () => import('@/views/Policies/TrafficPermissions')
      },
      {
        path: 'traffic-routes',
        name: 'traffic-routes',
        meta: { title: 'Traffic Routes' },
        component: () => import('@/views/Policies/TrafficRoutes')
      },
      {
        path: 'traffic-log',
        name: 'traffic-log',
        meta: { title: 'Traffic Log' },
        component: () => import('@/views/Policies/TrafficLog')
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
