import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const DEFAULT_WORKSPACE = 'default'

// routes: [
//   ,
//   {
//     // endpoint: /meshes/{name}/
//     path: '/:mesh/overview',
//     name: 'overview',
//     meta: { title: 'Global Overview' },
//     component: () => import('@/views/Overview/GlobalOverview')
//   },
//   {
//     // endpoint: /meshes/{name}/dataplanes
//     path: '/:mesh/dataplanes',
//     name: 'mesh-dataplanes',
//     component: () => import('@/views/Entities/EntityDataplanes'),
//     children: [
//       {
//         // endpoint: /meshes/{name}/dataplanes/{name}
//         path: ':dataplane',
//         name: 'mesh-dataplane-details',
//         meta: {
//           title: 'Dataplane Details'
//         },
//         component: () => import('@/views/Entities/EntityDataplanesDetail')
//       }
//     ]
//   },
//   {
//     // endpoint: ??????
//     path: '/:mesh/services',
//     name: 'services',
//     component: () => import('@/views/Entities/EntityServices'),
//     children: [
//       {
//         path: ':service',
//         name: 'service-details',
//         meta: {
//           title: 'Service Details'
//         },
//         component: () => import('@/views/Entities/EntityServicesDetail')
//       }
//     ]
//   },
//   {
//     // endpoint: ??????
//     path: '/:mesh/traffic-permissions',
//     name: 'traffic-permissions',
//     component: () => import('@/views/Policies/TrafficPermissions')
//   },
//   {
//     // endpoint: ??????
//     path: '/:mesh/traffic-routes',
//     name: 'traffic-routes',
//     component: () => import('@/views/Policies/TrafficRoutes')
//   },
//   {
//     // endpoint: ??????
//     path: '/:mesh/traffic-log',
//     name: 'traffic-log',
//     component: () => import('@/views/Policies/TrafficLog')
//   }
// ]

const routes = [
  {
    path: '/404',
    name: 'not-found',
    alias: '*',
    meta: { title: 'Page not found' },
    component: () => import('@/views/NotFound')
  },
  {
    path: '/overview',
    name: 'overview',
    meta: { title: 'Global Overview' },
    component: () => import('@/views/Overview/GlobalOverview')
  },
  {
    path: '/:workspace',
    name: 'mesh',
    meta: { title: 'mesh' },
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
