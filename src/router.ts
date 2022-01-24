import Vue from 'vue'
import { Store } from 'vuex'
import VueRouter from 'vue-router'
import { POLICY_MAP } from '@/consts'
import { RootInterface } from './store'

Vue.use(VueRouter)

export default (store: Store<RootInterface>) => {
  const routes = [
    {
      path: '/404',
      name: 'not-found',
      alias: '*',
      meta: {
        title: 'Page not found',
        excludeAsBreadcrumb: true,
      },
      component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue'),
    },
    // Home - a landing place that resets things
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "shell" */ '@/views/Shell.vue'),
      redirect: {
        name: 'global-overview',
        params: {
          mesh: 'all',
        },
      },
      children: [
        // App
        // diagnostics
        {
          path: '/diagnostics',
          name: 'diagnostics',
          component: () => import(/* webpackChunkName: "diagnostics" */ '@/views/Diagnostics.vue'),
          meta: {
            title: 'Diagnostics',
            breadcrumb: 'Diagnostics',
            hideSubnav: true,
          },
        },
        // Zones
        {
          path: '/zones',
          name: 'zones',
          meta: {
            title: 'Zones',
          },
          component: () => import(/* webpackChunkName: "zones" */ '@/views/Entities/Zones.vue'),
        },
        // Zone Ingresses
        {
          path: '/zone-ingresses',
          name: 'zoneingresses',
          meta: {
            title: 'Zone Ingresses',
          },
          component: () => import(/* webpackChunkName: "zoneingresses" */ '@/views/Entities/ZoneIngresses.vue'),
        },
        // Zone Egresses
        {
          path: '/zone-egresses',
          name: 'zoneegresses',
          meta: {
            title: 'Zone Egresses',
          },
          component: () => import(/* webpackChunkName: "zoneegresses" */ '@/views/Entities/ZoneEgresses.vue'),
        },
        // all Meshes
        {
          // TODO - talk if we want to have separate mesh view there
          path: '/meshes',
          name: 'all-meshes',
          meta: {
            title: 'Meshes',
            breadcrumb: 'Meshes',
            parent: 'global-overview',
          },
          params: { mesh: ':mesh' },
          redirect: {
            name: 'mesh-child',
            params: {
              mesh: 'all',
            },
          },
          component: {
            // Inline declaration of a component that renders our <router-view>
            render: (c: typeof Vue.prototype.$createElement) => c('router-view'),
          },
          children: [
            {
              path: ':mesh',
              name: 'mesh-child',
              meta: {
                title: 'Mesh Overview',
                parent: 'all-meshes',
              },
              params: { mesh: ':mesh' },
              component: () => import(/* webpackChunkName: "meshes" */ '@/views/Entities/Meshes.vue'),
            },
          ],
        },
        {
          path: '/mesh',
          name: 'mesh-individual',
          meta: {
            title: 'Mesh',
            breadcrumb: 'Mesh',
          },
          params: { mesh: ':mesh' },
          redirect: {
            name: 'global-overview',
            params: {
              mesh: 'all',
            },
          },
          component: {
            // Inline declaration of a component that renders our <router-view>
            render: (c: typeof Vue.prototype.$createElement) => c('router-view'),
          },
          children: [
            {
              path: ':mesh',
              name: 'mesh',
              meta: {
                title: 'Meshes',
                breadcrumb: 'Meshes',
                parent: 'all-meshes',
              },
              params: { mesh: ':mesh' },
              component: {
                // Inline declaration of a component that renders our <router-view>
                render: (c: typeof Vue.prototype.$createElement) => c('router-view'),
              },
              children: [
                // overview
                {
                  path: 'overview',
                  name: 'global-overview',
                  alias: '/',
                  meta: {
                    title: 'Global Overview',
                  },
                  component: () => import(/* webpackChunkName: "global-overview" */ '@/views/Overview.vue'),
                },
                // all dataplanes
                {
                  path: 'dataplanes',
                  name: 'dataplanes',
                  meta: {
                    title: 'Data Plane Proxies',
                  },
                  component: () => import(/* webpackChunkName: "dataplanes" */ '@/views/Entities/AllDataplanes.vue'),
                },
                // standard dataplanes
                {
                  path: 'standard-dataplanes',
                  name: 'standard-dataplanes',
                  component: () =>
                    import(/* webpackChunkName: "dataplanes-standard" */ '@/views/Entities/StandardDataplanes.vue'),
                  meta: {
                    title: 'Standard Data Plane Proxies',
                    breadcrumb: 'Standard Data Plane Proxies',
                  },
                },
                // gateway dataplanes
                {
                  path: 'gateway-dataplanes',
                  name: 'gateway-dataplanes',
                  component: () =>
                    import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/GatewayDataplanes.vue'),
                  meta: {
                    title: 'Gateway Data Plane Proxies',
                    breadcrumb: 'Gateway Data Plane Proxies',
                  },
                },
                // internal services
                {
                  path: 'internal-services',
                  name: 'internal-services',
                  component: () =>
                    import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/InternalServices.vue'),
                  meta: {
                    title: 'Internal Services',
                    breadcrumb: 'Internal Services',
                  },
                },
                // external services
                {
                  path: 'external-services',
                  name: 'external-services',
                  component: () =>
                    import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/ExternalServices.vue'),
                  meta: {
                    title: 'External Services',
                    breadcrumb: 'External Services',
                  },
                },
                // traffic permissions
                {
                  path: POLICY_MAP.TrafficPermission.route,
                  name: POLICY_MAP.TrafficPermission.route,
                  meta: {
                    title: POLICY_MAP.TrafficPermission.title,
                  },
                  component: () =>
                    import(/* webpackChunkName: "traffic-permissions" */ '@/views/Policies/TrafficPermissions.vue'),
                },
                // traffic routes
                {
                  path: POLICY_MAP.TrafficRoute.route,
                  name: POLICY_MAP.TrafficRoute.route,
                  meta: {
                    title: POLICY_MAP.TrafficRoute.title,
                  },
                  component: () =>
                    import(/* webpackChunkName: "traffic-routes" */ '@/views/Policies/TrafficRoutes.vue'),
                },
                // traffic logs
                {
                  path: POLICY_MAP.TrafficLog.route,
                  name: POLICY_MAP.TrafficLog.route,
                  meta: {
                    title: POLICY_MAP.TrafficLog.title,
                  },
                  component: () => import(/* webpackChunkName: "traffic-logs" */ '@/views/Policies/TrafficLogs.vue'),
                },
                // traffic traces
                {
                  path: POLICY_MAP.TrafficTrace.route,
                  name: POLICY_MAP.TrafficTrace.route,
                  meta: {
                    title: POLICY_MAP.TrafficTrace.title,
                  },
                  component: () =>
                    import(/* webpackChunkName: "traffic-traces" */ '@/views/Policies/TrafficTraces.vue'),
                },
                // fault injections
                {
                  path: POLICY_MAP.FaultInjection.route,
                  name: POLICY_MAP.FaultInjection.route,
                  meta: {
                    title: POLICY_MAP.FaultInjection.title,
                  },
                  component: () =>
                    import(/* webpackChunkName: "fault-injections" */ '@/views/Policies/FaultInjections.vue'),
                },
                // circuit breakers
                {
                  path: POLICY_MAP.CircuitBreaker.route,
                  name: POLICY_MAP.CircuitBreaker.route,
                  meta: {
                    title: POLICY_MAP.CircuitBreaker.title,
                  },
                  component: () =>
                    import(/* webpackChunkName: "circuit-breakers" */ '@/views/Policies/CircuitBreakers.vue'),
                },
                // health checks
                {
                  path: POLICY_MAP.HealthCheck.route,
                  name: POLICY_MAP.HealthCheck.route,
                  meta: {
                    title: POLICY_MAP.HealthCheck.title,
                  },
                  component: () => import(/* webpackChunkName: "health-checks" */ '@/views/Policies/HealthChecks.vue'),
                },
                // proxy templates
                {
                  path: POLICY_MAP.ProxyTemplate.route,
                  name: POLICY_MAP.ProxyTemplate.route,
                  meta: {
                    title: POLICY_MAP.ProxyTemplate.title,
                  },
                  component: () =>
                    import(/* webpackChunkName: "proxy-templates" */ '@/views/Policies/ProxyTemplates.vue'),
                },
                // rate limits
                {
                  path: POLICY_MAP.RateLimit.route,
                  name: POLICY_MAP.RateLimit.route,
                  meta: {
                    title: POLICY_MAP.RateLimit.title,
                  },
                  component: () => import(/* webpackChunkName: "rate-limits" */ '@/views/Policies/RateLimits.vue'),
                },
                // retries
                {
                  path: POLICY_MAP.Retry.route,
                  name: POLICY_MAP.Retry.route,
                  meta: {
                    title: POLICY_MAP.Retry.title,
                  },
                  component: () => import(/* webpackChunkName: "retries" */ '@/views/Policies/Retries.vue'),
                },
                // timeouts
                {
                  path: POLICY_MAP.Timeout.route,
                  name: POLICY_MAP.Timeout.route,
                  meta: {
                    title: POLICY_MAP.Timeout.title,
                  },
                  component: () => import(/* webpackChunkName: "timeouts" */ '@/views/Policies/Timeouts.vue'),
                },
                // gateways
                {
                  path: POLICY_MAP.Gateway.route,
                  name: POLICY_MAP.Gateway.route,
                  meta: {
                    title: POLICY_MAP.Gateway.title,
                  },
                  component: () => import(/* webpackChunkName: "gateways" */ '@/views/Policies/Gateways.vue'),
                },
                // gateway routes
                {
                  path: POLICY_MAP.GatewayRoute.route,
                  name: POLICY_MAP.GatewayRoute.route,
                  meta: {
                    title: POLICY_MAP.GatewayRoute.title,
                  },
                  component: () =>
                    import(/* webpackChunkName: "gateway-routes" */ '@/views/Policies/GatewayRoutes.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
    // Onboarding
    {
      path: '/onboarding',
      redirect: { name: 'onboarding-welcome' },
      component: () => import(/* webpackChunkName: "shell" */ '@/views/ShellEmpty.vue'),
      children: [
        {
          path: 'welcome',
          name: 'onboarding-welcome',
          meta: {
            title: `Welcome to ${process.env.VUE_APP_NAMESPACE}!`,
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/Welcome.vue'),
        },
        {
          path: 'deployment-types',
          name: 'onboarding-deployment-types',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/DeploymentTypes.vue'),
        },
        {
          path: 'configuration-types',
          name: 'onboarding-configuration-types',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/ConfigurationTypes.vue'),
        },
        {
          path: 'multi-zone',
          name: 'onboarding-multi-zone',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/MultiZone.vue'),
        },
        {
          path: 'create-mesh',
          name: 'onboarding-create-mesh',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/CreateMesh.vue'),
        },
        {
          path: 'add-services',
          name: 'onboarding-add-services',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/AddNewServices.vue'),
        },
        {
          path: 'add-services-code',
          name: 'onboarding-add-services-code',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/AddNewServicesCode.vue'),
        },
        {
          path: 'dataplanes-overview',
          name: 'onboarding-dataplanes-overview',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/DataplanesOverview.vue'),
        },
        {
          path: 'completed',
          name: 'onboarding-completed',
          meta: {
            onboardingProcess: true,
          },
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/Completed.vue'),
        },
      ],
    },
    {
      // Entity Wizard
      path: '/wizard',
      name: 'wizard',
      component: () => import(/* webpackChunkName: "shell" */ '@/views/ShellWithHeader.vue'),
      children: [
        {
          path: 'mesh',
          name: 'create-mesh',
          meta: {
            title: 'Create a new Mesh',
            wizardProcess: true,
            hideStatus: true,
          },
          component: () => import(/* webpackChunkName: "wizard-mesh" */ '@/views/Wizard/views/Mesh.vue'),
        },
        {
          path: 'kubernetes-dataplane',
          name: 'kubernetes-dataplane',
          meta: {
            title: 'Create a new Kubernetes Dataplane',
            wizardProcess: true,
            hideStatus: true,
          },
          component: () =>
            import(
              /* webpackChunkName: "wizard-dataplane-kubernetes" */ '@/views/Wizard/views/DataplaneKubernetes.vue'
            ),
        },
        {
          path: 'universal-dataplane',
          name: 'universal-dataplane',
          meta: {
            title: 'Create a new Universal Dataplane',
            wizardProcess: true,
            hideStatus: true,
          },
          component: () =>
            import(/* webpackChunkName: "wizard-dataplane-universal" */ '@/views/Wizard/views/DataplaneUniversal.vue'),
        },
      ],
    },
  ]
  const router = new VueRouter({
    /**
     * Defaulting to hash mode since this runs within Kuma itself
     * and it's easier to avoid having to do advanced server config
     * simply for hash-free URLs.
     */
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: routes,
  })

  /**
   * If users change page make sure it updates selected mesh
   */
  router.beforeEach((to, from, next) => {
    const mesh = store.state.selectedMesh

    const ongoingMesh = to.params.mesh

    if (ongoingMesh && mesh !== ongoingMesh) {
      store.dispatch('updateSelectedMesh', ongoingMesh)
    }

    next()
  })
  /**
   * If the user hasn't gone through the setup/onboarding process yet, this
   * sends them through it. Once completed, a localStorage value is set to true
   * so that they're not sent through it again.
   */

  router.beforeEach(async (to, from, next) => {
    // eslint-disable-next-line no-unmodified-loop-condition
    // This below is to make sure the inital calls have been fulfilled and it does not try to
    // access any route before it will be resolved
    while (store.getters.globalLoading) {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(null)
        }, 20)
      })
    }

    const showOnboarding = store.getters['onboarding/showOnboarding']
    const isCompleted = store.state.onboarding.isCompleted

    const onboardingRoute = to.meta.onboardingProcess

    // If someone is going to open onboarding page but fulfiled already conditionn related to
    // show onboarding, then redirect user to overview
    if (onboardingRoute && !showOnboarding) {
      next({ name: 'global-overview' })
      // if someone never had onboarding and do not fulfiled condition to skip it
      // and try to access some other page than onboarding ones
      // then redirect into first onboarding page
    } else if (!onboardingRoute && showOnboarding && !isCompleted) {
      const name = localStorage.getItem('onboarding/step') || 'onboarding-welcome'

      next({ name })
    } else {
      next()
    }
  })

  return router
}
