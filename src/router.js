import Vue from 'vue'
import Router from 'vue-router'
import Overview from './views/Overview.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import(/* webpackChunkName: "overview" */ './views/Overview.vue')
    },
    {
      path: '/entities/services',
      name: 'services',
      component: () => import(/* webpackChunkName: "entity-services" */ './views/Entities/EntityServices.vue')
    },
    {
      path: '/entities/dataplanes',
      name: 'dataplanes',
      component: () => import(/* webpackChunkName: "entity-dataplanes" */ './views/Entities/EntityDataplanes.vue')
    },
    {
      path: '/policies/traffic-permissions',
      name: 'traffic-permissions',
      component: () => import(/* webpackChunkName: "traffic-permissions" */ './views/Policies/TrafficPermissions.vue')
    },
    {
      path: '/policies/traffic-routes',
      name: 'traffic-routes',
      component: () => import(/* webpackChunkName: "traffic-routes" */ './views/Policies/TrafficRoutes.vue')
    },
    {
      path: '/policies/traffic-log',
      name: 'traffic-log',
      component: () => import(/* webpackChunkName: "traffic-log" */ './views/Policies/TrafficLog.vue')
    },
    // dynamic routes
    {
      path: '/overview/:entity',
      name: 'overview-entity',
      component: () => import(/* webpackChunkName: "overview-entity" */ './views/Overview.vue')
    }
  ]
})
