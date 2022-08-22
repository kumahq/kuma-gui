import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import { store } from '../store/store'
import { Policy } from '../types'

function getPolicyRoutes(policies: Policy[]): RouteRecordRaw[] {
  return policies.map((policy) => ({
    path: policy.path,
    name: policy.path,
    meta: {
      shouldReRender: true,
      title: policy.pluralDisplayName,
    },
    props: {
      policyPath: policy.path,
    },
    component: () => import(/* webpackChunkName: "policy-view" */ '@/views/Policies/PolicyView.vue'),
  }))
}

export async function setupRouter() {
  // Loads available policies in order to populate the necessary routes.
  await store.dispatch('fetchPolicies')
  const policyRoutes = getPolicyRoutes(store.state.policies)

  const routes = [
    {
      path: '/404',
      name: 'not-found',
      alias: '/:pathMatch(.*)*',
      meta: {
        title: 'Item not found',
        excludeAsBreadcrumb: true,
      },
      component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue'),
    },
    // Home - a landing place that resets things
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "shell" */ '@/views/AppShell.vue'),
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
          component: () => import(/* webpackChunkName: "diagnostics" */ '@/views/DiagnosticsView.vue'),
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
          component: () => import(/* webpackChunkName: "zones" */ '@/views/Entities/ZonesView.vue'),
        },
        // Zone Ingresses
        {
          path: '/zone-ingresses',
          name: 'zoneingresses',
          meta: {
            title: 'Zone ingresses',
          },
          component: () => import(/* webpackChunkName: "zoneingresses" */ '@/views/Entities/ZoneIngresses.vue'),
        },
        // Zone Egresses
        {
          path: '/zoneegresses',
          name: 'zoneegresses',
          meta: {
            title: 'Zone egresses',
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
          redirect: {
            name: 'mesh-child',
            params: {
              mesh: 'all',
            },
          },
          children: [
            {
              path: ':mesh',
              name: 'mesh-child',
              meta: {
                title: 'Meshes',
                parent: 'all-meshes',
              },
              component: () => import(/* webpackChunkName: "meshes" */ '@/views/Entities/MeshesView.vue'),
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
          redirect: {
            name: 'global-overview',
            params: {
              mesh: 'all',
            },
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
              children: [
                // overview
                {
                  path: 'overview',
                  name: 'global-overview',
                  // alias: '/',
                  meta: {
                    title: 'Global Overview',
                  },
                  component: () => import(/* webpackChunkName: "global-overview" */ '@/views/OverviewView.vue'),
                },
                // all dataplanes
                {
                  path: 'dataplanes',
                  name: 'dataplanes',
                  meta: {
                    title: 'Data plane proxies',
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
                    title: 'Standard data plane proxies',
                    breadcrumb: 'Standard data plane proxies',
                  },
                },
                // gateway dataplanes
                {
                  path: 'gateway-dataplanes',
                  name: 'gateway-dataplanes',
                  component: () =>
                    import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/GatewayDataplanes.vue'),
                  meta: {
                    title: 'Gateway data plane proxies',
                    breadcrumb: 'Gateway data plane proxies',
                  },
                },
                // internal services
                {
                  path: 'internal-services',
                  name: 'internal-services',
                  component: () =>
                    import(/* webpackChunkName: "dataplanes-gateway" */ '@/views/Entities/InternalServices.vue'),
                  meta: {
                    title: 'Internal services',
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
                    title: 'External services',
                    breadcrumb: 'External Services',
                  },
                },
                ...policyRoutes,
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
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/WelcomeView.vue'),
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
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/MultiZoneView.vue'),
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
          component: () => import(/* webpackChunkName: "onboarding" */ '@/views/Onboarding/CompletedView.vue'),
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
            title: 'Create a new Dataplane on Kubernetes',
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
            title: 'Create a new Dataplane on Universal',
            wizardProcess: true,
            hideStatus: true,
          },
          component: () =>
            import(/* webpackChunkName: "wizard-dataplane-universal" */ '@/views/Wizard/views/DataplaneUniversal.vue'),
        },
      ],
    },
  ]

  const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
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
    const isCompleted = store.state.onboarding?.isCompleted

    const onboardingRoute = to.meta?.onboardingProcess

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
