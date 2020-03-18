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
    //   meta: {
    //     title: 'Test Overview'
    //   },
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
            simpleContent: true,
            onboardingProcess: true
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
            simpleContent: true,
            onboardingProcess: true
          },
          component: () => import('@/views/Onboarding/Complete')
        }
        // {
        //   path: 'restart',
        //   name: 'setup-restart',
        //   meta: {
        //     title: 'Setup Already Complete!',
        //     excludeAsBreadcrumb: true,
        //     hideSidebar: true,
        //     hideStatus: true,
        //     simpleHeader: true,
        //     simpleContent: true,
        //     onboardingProcess: true
        //   },
        //   component: () => import('@/views/Onboarding/Restart')
        // }
      ]
    },
    // App
    {
      path: '/overview',
      alias: '/',
      name: 'global-overview',
      meta: {
        title: 'Global Overview',
        breadcrumb: 'Overview'
      },
      component: () => import('@/views/Overview')
    },
    {
      path: '/:mesh',
      redirect: { name: 'mesh-overview' },
      name: 'mesh',
      meta: {
        title: 'Meshes',
        breadcrumb: 'Meshes',
        parent: 'mesh-overview'
      },
      params: { mesh: ':mesh' },
      component: () => import('@/views/Shell'),
      children: [
        // meshes
        {
          path: 'overview',
          name: 'mesh-overview',
          component: () => import('@/views/Entities/EntityOverview'),
          meta: {
            title: 'Mesh Overview',
            excludeAsBreadcrumb: true
          }
        },
        // dataplanes
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
            breadcrumb: 'Dataplanes',
            parent: 'dataplanes'
          },
          params: {
            dataplane: ':dataplane'
          },
          component: () => import('@/views/Entities/EntityDataplanesDetail')
        },
        // services
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
          meta: {
            title: 'Service Details',
            breadcrumb: 'Service Details',
            parent: 'services'
          },
          params: {
            service: ':service'
          },
          component: () => import('@/views/Entities/EntityServicesDetail')
        },
        // traffic permissions
        {
          path: 'traffic-permissions',
          name: 'traffic-permissions',
          meta: {
            title: 'Traffic Permissions'
          },
          component: () => import('@/views/Policies/TrafficPermissions')
        },
        {
          path: 'traffic-permissions/:trafficpermission',
          name: 'traffic-permissions-details',
          meta: {
            title: 'Traffic Permission Details',
            breadcrumb: 'Traffic Permission Details',
            parent: 'traffic-permissions'
          },
          params: {
            trafficpermission: ':trafficpermission'
          },
          component: () => import('@/views/Policies/TrafficPermissionsDetail')
        },
        // traffic routes
        {
          path: 'traffic-routes',
          name: 'traffic-routes',
          meta: {
            title: 'Traffic Routes'
          },
          component: () => import('@/views/Policies/TrafficRoutes')
        },
        {
          path: 'traffic-routes/:trafficroute',
          name: 'traffic-routes-details',
          params: {
            trafficroute: ':trafficroute'
          },
          meta: {
            title: 'Traffic Route Details',
            breadcrumb: 'Traffic Details',
            parent: 'traffic-routes'
          },
          component: () => import('@/views/Policies/TrafficRouteDetail')
        },
        // traffic logs
        {
          path: 'traffic-logs',
          name: 'traffic-logs',
          meta: {
            title: 'Traffic Logs'
          },
          component: () => import('@/views/Policies/TrafficLog')
        },
        {
          path: 'traffic-logs/:trafficlog',
          name: 'traffic-log-details',
          params: {
            trafficlog: ':trafficlog'
          },
          meta: {
            title: 'Traffic Log Details',
            breadcrumb: 'Traffic Logs',
            parent: 'traffic-logs'
          },
          component: () => import('@/views/Policies/TrafficLogDetail')
        },
        // traffic traces
        {
          path: 'traffic-traces',
          name: 'traffic-traces',
          meta: {
            title: 'Traffic Traces'
          },
          component: () => import('@/views/Policies/TrafficTrace')
        },
        {
          path: 'traffic-traces/:traffictrace',
          name: 'traffic-traces-details',
          params: {
            traffictrace: ':traffictrace'
          },
          meta: {
            title: 'Traffic Trace Details',
            breadcrumb: 'Traffic Traces',
            parent: 'traffic-traces'
          },
          component: () => import('@/views/Policies/TrafficTraceDetail')
        },
        // health checks
        {
          path: 'health-checks',
          name: 'health-checks',
          meta: {
            title: 'Health Checks'
          },
          component: () => import('@/views/HealthChecks/HealthChecks')
        },
        {
          path: 'health-checks/:healthcheck',
          name: 'health-checks-details',
          params: {
            healthcheck: ':healthcheck'
          },
          meta: {
            title: 'Health Check Details',
            breadcrumb: 'Health Checks',
            parent: 'health-checks'
          },
          component: () => import('@/views/HealthChecks/HealthChecksDetail')
        },
        // proxy templates
        {
          path: 'proxy-templates',
          name: 'proxy-templates',
          meta: {
            title: 'Proxy Templates'
          },
          component: () => import('@/views/Policies/ProxyTemplates')
        },
        {
          path: 'proxy-templates/:proxytemplate',
          name: 'proxy-templates-details',
          params: {
            proxytemplate: ':proxytemplate'
          },
          meta: {
            title: 'Proxy Templates',
            breadcrumb: 'Proxy Templates',
            parent: 'proxy-templates'
          },
          component: () => import('@/views/Policies/ProxyTemplatesDetail')
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
    const hasOnboarded = JSON.parse(localStorage.getItem('kumaOnboardingComplete') || null)
    const currentRoute = to.meta.onboardingProcess

    if ((!hasOnboarded || hasOnboarded === false) && !currentRoute) {
      next({ name: 'setup-welcome' })
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
