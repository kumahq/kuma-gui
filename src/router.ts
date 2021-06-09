import Vue from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'

Vue.use(VueRouter)

export default (store: Store<any>) => {
  const routes = [
    {
      path: '/404',
      name: 'not-found',
      alias: '*',
      meta: {
        title: 'Page not found',
        excludeAsBreadcrumb: true
      },
      component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue')
    },
    // Home - a landing place that resets things
    {
      path: '/',
      name: 'home',
      redirect: {
        name: 'global-overview',
        params: {
          mesh: 'all'
        }
      }
    },
    // Onboarding
    {
      path: '/get-started',
      redirect: { name: 'setup-welcome' },
      component: () => import('@/views/ShellEmpty.vue'),
      children: [
        {
          path: 'welcome',
          name: 'setup-welcome',
          meta: {
            title: `Welcome to ${process.env.VUE_APP_NAMESPACE}!`,
            excludeAsBreadcrumb: true,
            hideSidebar: true,
            hideStatus: true,
            simpleHeader: true,
            simpleContent: true,
            onboardingProcess: true
          },
          component: () => import(/* webpackChunkName: "onboarding-get-started" */ '@/views/Onboarding/GetStarted.vue')
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
          component: () => import(/* webpackChunkName: "onboarding-complete" */ '@/views/Onboarding/Complete.vue')
        }
      ]
    },
    {
      // Entity Wizard
      path: '/wizard',
      name: 'wizard',
      component: () => import(/* webpackChunkName: "shell-default" */ '@/views/Shell.vue'),
      children: [
        {
          path: 'mesh',
          name: 'create-mesh',
          meta: {
            title: 'Create a new Mesh',
            excludeAsBreadcrumb: true,
            wizardProcess: true
          },
          component: () => import(/* webpackChunkName: "wizard-mesh" */ '@/views/Wizard/views/Mesh.vue')
        },
        {
          path: 'kubernetes-dataplane',
          name: 'kubernetes-dataplane',
          meta: {
            title: 'Create a new Kubernetes Dataplane',
            excludeAsBreadcrumb: true,
            wizardProcess: true
          },
          component: () => import(/* webpackChunkName: "wizard-dataplane-kubernetes" */ '@/views/Wizard/views/DataplaneKubernetes.vue')
        },
        {
          path: 'universal-dataplane',
          name: 'universal-dataplane',
          meta: {
            title: 'Create a new Universal Dataplane',
            excludeAsBreadcrumb: true,
            wizardProcess: true
          },
          component: () => import(/* webpackChunkName: "wizard-dataplane-universal" */ '@/views/Wizard/views/DataplaneUniversal.vue')
        }
      ]
    },
    // App

    // diagnostics
    {
      path: '/diagnostics',
      name: 'diagnostics',
      component: () => import(/* webpackChunkName: "diagnostics" */ '@/views/Diagnostics.vue'),
      meta: {
        title: 'Diagnostics',
        breadcrumb: 'Diagnostics',
        hideSubnav: true
      }
    },
    // Zones
    {
      path: '/zones',
      name: 'zones',
      meta: {
        title: 'Zones'
      },
      component: () => import(/* webpackChunkName: "zones" */ '@/views/Entities/Zones.vue')
    },
    // all Meshes
    {
      path: '/meshes',
      name: 'all-meshes',
      meta: {
        title: 'Meshes',
        breadcrumb: 'Meshes',
        parent: 'global-overview'
      },
      params: { mesh: ':mesh' },
      component: () => import(/* webpackChunkName: "shell-default" */ '@/views/Shell.vue'),
      children: [
        {
          path: ':mesh',
          name: 'mesh-child',
          meta: {
            title: 'Mesh Overview',
            parent: 'all-meshes'
          },
          params: { mesh: ':mesh' },
          component: () => import(/* webpackChunkName: "meshes" */ '@/views/Entities/Meshes.vue')
        }
      ]
    },
    {
      path: '/:mesh',
      name: 'mesh',
      meta: {
        title: 'Meshes',
        breadcrumb: 'Meshes',
        parent: 'all-meshes'
      },
      params: { mesh: ':mesh' },
      component: () => import(/* webpackChunkName: "shell-default" */ '@/views/Shell.vue'),
      children: [
        // overview
        {
          path: 'overview',
          name: 'global-overview',
          alias: '/',
          meta: {
            title: 'Global Overview'
          },
          component: () => import(/* webpackChunkName: "global-overview" */ '@/views/Overview.vue')
        },
        // Zones
        // {
        //   path: 'zones',
        //   name: 'zones',
        //   meta: {
        //     title: 'Zones'
        //   },
        //   component: () => import(/* webpackChunkName: "zones" */ '@/views/Entities/Zones.vue')
        // },
        // all dataplanes
        {
          path: 'dataplanes',
          name: 'dataplanes',
          meta: {
            title: 'Data Plane Proxies'
          },
          component: () => import(/* webpackChunkName: "dataplanes" */ '@/views/Entities/AllDataplanes.vue')
        },
        // standard dataplanes
        {
          path: 'standard-dataplanes',
          name: 'standard-dataplanes',
          component: () => import(/* webpackChunkName: "dataplanes-standard" */ '@/views/Entities/StandardDataplanes.vue'),
          meta: {
            title: 'Standard Data Plane Proxies',
            breadcrumb: 'Standard Data Plane Proxies'
          }
        },
        // ingress dataplanes
        {
          path: 'ingress-dataplanes',
          name: 'ingress-dataplanes',
          component: () => import(/* webpackChunkName: "dataplanes-ingress" */ '@/views/Entities/IngressDataplanes.vue'),
          meta: {
            title: 'Ingress Data Plane Proxies',
            breadcrumb: 'Ingress Data Plane Proxies'
          }
        },
        // gateway dataplanes
        {
          path: 'gateway-dataplanes',
          name: 'gateway-dataplanes',
          component: () => import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/GatewayDataplanes.vue'),
          meta: {
            title: 'Gateway Data Plane Proxies',
            breadcrumb: 'Gateway Data Plane Proxies'
          }
        },
        // internal services
        {
          path: 'internal-services',
          name: 'internal-services',
          component: () => import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/InternalServices.vue'),
          meta: {
            title: 'Internal Services',
            breadcrumb: 'Internal Services'
          }
        },
        // external services
        {
          path: 'external-services',
          name: 'external-services',
          component: () => import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/ExternalServices.vue'),
          meta: {
            title: 'External Services',
            breadcrumb: 'External Services'
          }
        },
        // traffic permissions
        {
          path: 'traffic-permissions',
          name: 'traffic-permissions',
          meta: {
            title: 'Traffic Permissions'
          },
          component: () => import(/* webpackChunkName: "traffic-permissions" */ '@/views/Policies/TrafficPermissions.vue')
        },
        // traffic routes
        {
          path: 'traffic-routes',
          name: 'traffic-routes',
          meta: {
            title: 'Traffic Routes'
          },
          component: () => import(/* webpackChunkName: "traffic-routes" */ '@/views/Policies/TrafficRoutes.vue')
        },
        // traffic logs
        {
          path: 'traffic-logs',
          name: 'traffic-logs',
          meta: {
            title: 'Traffic Logs'
          },
          component: () => import(/* webpackChunkName: "traffic-logs" */ '@/views/Policies/TrafficLogs.vue')
        },
        // traffic traces
        {
          path: 'traffic-traces',
          name: 'traffic-traces',
          meta: {
            title: 'Traffic Traces'
          },
          component: () => import(/* webpackChunkName: "traffic-traces" */ '@/views/Policies/TrafficTraces.vue')
        },
        // fault injections
        {
          path: 'fault-injections',
          name: 'fault-injections',
          meta: {
            title: 'Fault Injections'
          },
          component: () => import(/* webpackChunkName: "fault-injections" */ '@/views/Policies/FaultInjections.vue')
        },
        // circuit breakers
        {
          path: 'circuit-breakers',
          name: 'circuit-breakers',
          meta: {
            title: 'Circuit Breakers'
          },
          component: () => import(/* webpackChunkName: "circuit-breakers" */ '@/views/Policies/CircuitBreakers.vue')
        },
        // health checks
        {
          path: 'health-checks',
          name: 'health-checks',
          meta: {
            title: 'Health Checks'
          },
          component: () => import(/* webpackChunkName: "health-checks" */ '@/views/Policies/HealthChecks.vue')
        },
        // proxy templates
        {
          path: 'proxy-templates',
          name: 'proxy-templates',
          meta: {
            title: 'Proxy Templates'
          },
          component: () => import(/* webpackChunkName: "proxy-templates" */ '@/views/Policies/ProxyTemplates.vue')
        },
        // rate limits
        {
          path: 'rate-limits',
          name: 'rate-limits',
          meta: {
            title: 'Rate Limits'
          },
          component: () => import(/* webpackChunkName: "rate-limits" */ '@/views/Policies/RateLimits.vue')
        },
        // retries
        {
          path: 'retries',
          name: 'retries',
          meta: {
            title: 'Retries'
          },
          component: () => import(/* webpackChunkName: "retries" */ '@/views/Policies/Retries.vue')
        },
        // timeouts
        {
          path: 'timeouts',
          name: 'timeouts',
          meta: {
            title: 'Timeouts'
          },
          component: () => import(/* webpackChunkName: "timeouts" */ '@/views/Policies/Timeouts.vue')
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

  /**
   * If the user is sent to the homepage root url ("/")
   * redirect them to the Global Overview and set the mesh to "all".
   * This ensures they get to the desired starting page once finished
   * with the onboarding process.
   *
   * When the user is sent to the Global Overview from the root, this will also
   * changed the selected mesh in their localStorage if it's set to something
   * other than "all".
   */
  router.beforeEach((to, from, next) => {
    const isRoot = to.fullPath === '/'
    const storedMesh = localStorage.getItem('selectedMesh') || null
    const targetMesh = 'all'

    if (isRoot) {
      /** sync the mesh in localStorage with the route change */
      if (storedMesh && storedMesh !== targetMesh) {
        localStorage.setItem('selectedMesh', targetMesh)
      }

      /** send the user to the Global Overview from "/" */
      next({
        name: 'global-overview',
        params: { mesh: targetMesh }
      })
    } else {
      next()
    }
  })

  /**
   * This will make sure that the Meshes page displays all meshes
   * if the user happens to go to the bare `/meshes` url with no
   * query on the end of it.
   */
  router.beforeEach((to, from, next) => {
    if (to.name === 'all-meshes') {
      next({
        name: 'mesh-child',
        params: { mesh: 'all' }
      })
    } else {
      next()
    }
  })

  /**
   * If the user hasn't gone through the setup/onboarding process yet, this
   * sends them through it. Once completed, a localStorage value is set to true
   * so that they're not sent through it again.
   */
  router.beforeEach((to, from, next) => {
    const hasOnboarded = JSON.parse(localStorage.getItem('kumaOnboardingComplete') || 'false')
    const currentRoute = to.meta.onboardingProcess

    if ((!hasOnboarded || hasOnboarded === false) && !currentRoute) {
      next({ name: 'setup-welcome' })
    } else {
      next()
    }
  })

  router.onReady(() => {
    store.commit('SET_GLOBAL_LOADING', { globalLoading: true })

    setTimeout(() => {
      store.commit('SET_GLOBAL_LOADING', { globalLoading: false })
    }, 1000)
  })

  return router
}
