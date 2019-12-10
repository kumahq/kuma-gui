import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default (store) => {
  const routes = [
    {
      path: '/404',
      name: 'not-found',
      alias: '*',
      meta: {
        title: 'Page not found',
        excludeAsBreadcrumb: true
      },
      component: () => import('@/views/NotFound')
    },
    // for testing the data overview skeleton component
    // {
    //   path: '/test',
    //   name: 'test-overview',
    //   component: () => import('@/views/Entities/TestOverview')
    // },
    {
      path: '/',
      redirect: { name: 'global-overview' }
    },
    // Onboarding
    {
      path: '/get-started',
      redirect: { name: 'setup-welcome' },
      component: () => import('@/views/ShellEmpty'),
      children: [
        {
          path: 'welcome',
          name: 'setup-welcome',
          meta: {
            title: 'Welcome to Kuma!',
            excludeAsBreadcrumb: true,
            hideSidebar: true,
            hideStatus: true,
            simpleHeader: true,
            simpleContent: true
          },
          component: () => import('@/views/Onboarding/GetStarted')
        },
        {
          path: 'complete',
          name: 'setup-complete',
          meta: {
            title: 'Congratulations!',
            excludeAsBreadcrumb: true,
            hideSidebar: true,
            hideStatus: true,
            simpleHeader: true,
            simpleContent: true
          },
          component: () => import('@/views/Onboarding/Complete')
        }
      ]
    },
    // App
    {
      path: '/overview',
      alias: '/',
      name: 'global-overview',
      meta: {
        title: 'Global Overview',
        excludeAsBreadcrumb: true
      },
      component: () => import('@/views/Overview')
    },
    {
      path: '/:mesh',
      redirect: { name: 'mesh-overview' },
      name: 'mesh',
      meta: {
        title: 'Overview',
        breadcrumb: 'Global Overview',
        parent: 'global-overview'
      },
      params: { mesh: ':mesh' },
      component: () => import('@/views/Shell'),
      children: [
        {
          path: 'overview',
          name: 'mesh-overview',
          component: () => import('@/views/Entities/EntityOverview'),
          meta: {
            title: 'Mesh Overview',
            parent: 'mesh-overview'
          }
        },
        {
          path: 'dataplanes',
          name: 'dataplanes',
          meta: {
            title: 'Dataplanes',
            parent: 'dataplanes'
          },
          component: () => import('@/views/Entities/EntityDataplanes')
        },
        {
          path: 'dataplanes/:dataplane',
          name: 'dataplane-details',
          meta: {
            title: 'Dataplane Details',
            parent: 'dataplanes'
          },
          params: { dataplane: ':dataplane' },
          component: () => import('@/views/Entities/EntityDataplanesDetail')
        },
        {
          path: 'services',
          name: 'services',
          meta: {
            title: 'Services'
          },
          component: () => import('@/views/Entities/EntityServices')
        },
        {
          path: 'services/:service',
          name: 'service-details',
          params: {
            service: ':service',
            breadcrumb: 'Services',
            parent: 'mesh-overview'
          },
          component: () => import('@/views/Entities/EntityServicesDetail')
        },
        {
          path: 'traffic-permissions',
          name: 'traffic-permissions',
          meta: {
            title: 'Traffic Permissions',
            breadcrumb: 'Traffic Permissions',
            parent: 'mesh-overview'
          },
          component: () => import('@/views/Policies/TrafficPermissions')
          // child routes?
        },
        {
          path: 'traffic-routes',
          name: 'traffic-routes',
          meta: {
            title: 'Traffic Routes',
            breadcrumb: 'Traffic Routes',
            parent: 'mesh-overview'
          },
          component: () => import('@/views/Policies/TrafficRoutes')
          // child routes?
        },
        {
          path: 'traffic-log',
          name: 'traffic-log',
          meta: {
            title: 'Traffic Logs',
            breadcrumb: 'Traffic Logs',
            parent: '#'
          },
          component: () => import('@/views/Policies/TrafficLog')
          // child routes?
        }
      ]
    }
  ]

  const router = new VueRouter({
    /**
     * Defaulting to hash mode since this runs within Kuma itself
     * and it's easier to avoid having to do advanced server config
     * simply for hash-free URLs.
     */
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: routes
  })

  // Set $router.previous on each route
  router.beforeResolve((to, from, next) => {
    router.previous = from
    next()
  })

  /**
   * A route guard for handling the onboarding process. If the user hasn't gone
   * through the setup/onboarding process yet, this sends them through it. Once
   * completed, a localStorage value is set to true so that they're not sent
   * through it again.
   */
  router.beforeEach((to, from, next) => {
    const hasOnboarded = localStorage.getItem('kumaOnboardingComplete')
    const currentRoute = to.name

    if (!hasOnboarded && currentRoute !== 'setup-welcome' && currentRoute !== 'setup-complete') {
      next({
        name: 'setup-welcome'
      })
    } else {
      next()
    }
  })

  /**
   * Navigate up URL hierarchy
   *
   * @param {Number} levels - number of url directories to jump up e.g. if
   *   "/consumers/123/update" is currentRoute, then levels = 2 would return
   *   "/consumers"
   * @param {Boolean} redirect - if true, this will perform a redirect
   * @returns {String} returns the path of the path calculation
   */
  router.navigateUp = function (levels = 1, redirect = true) {
    var upperPath = this.currentRoute.path.split('/')

    if (upperPath.length >= levels) {
      upperPath.splice(upperPath.length - levels)
      const path = upperPath.join('/')

      redirect && this.push({ path })

      return path
    }
  }

  router.onReady(() => {
    store.commit('SET_GLOBAL_LOADING', { globalLoading: true })

    setTimeout(() => {
      store.commit('SET_GLOBAL_LOADING', { globalLoading: false })
    }, 1000)
  })

  return router
}
