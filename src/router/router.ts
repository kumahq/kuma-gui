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
    component: () => import('@/views/Policies/PolicyView.vue'),
  }))
}

export async function setupRouter() {
  // Loads available policies in order to populate the necessary routes.
  await store.dispatch('fetchPolicies')
  const policyRoutes = getPolicyRoutes(store.state.policies)

  const routes: readonly RouteRecordRaw[] = [
    {
      path: '/404',
      name: 'not-found',
      alias: '/:pathMatch(.*)*',
      meta: {
        title: 'Item not found',
        excludeAsBreadcrumb: true,
      },
      component: () => import('@/views/NotFound.vue'),
    },
    // Home - a landing place that resets things
    {
      path: '/',
      name: 'home',
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
          component: () => import('@/views/DiagnosticsView.vue'),
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
          component: () => import('@/views/Entities/ZonesView.vue'),
        },
        // Zone Ingresses
        {
          path: '/zone-ingresses',
          name: 'zoneingresses',
          meta: {
            title: 'Zone ingresses',
          },
          component: () => import('@/views/Entities/ZoneIngresses.vue'),
        },
        // Zone Egresses
        {
          path: '/zoneegresses',
          name: 'zoneegresses',
          meta: {
            title: 'Zone egresses',
          },
          component: () => import('@/views/Entities/ZoneEgresses.vue'),
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
              component: () => import('@/views/Entities/MeshesView.vue'),
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
                {
                  path: 'overview',
                  name: 'global-overview',
                  meta: {
                    title: 'Global Overview',
                  },
                  component: () => import('@/views/OverviewView.vue'),
                },
                {
                  path: 'data-planes',
                  children: [
                    {
                      path: '',
                      name: 'data-plane-list-view',
                      meta: {
                        title: 'Data planes',
                      },
                      props(route) {
                        const offsets = Array.isArray(route.query.offset) ? route.query.offset : [route.query.offset]
                        const offset = parseInt(offsets[offsets.length - 1] ?? '0') || 0

                        return {
                          name: route.query.name,
                          offset,
                        }
                      },
                      component: () => import('@/data-planes/views/DataPlaneListView.vue'),
                    },
                    {
                      path: ':dataPlane',
                      name: 'data-plane-detail-view',
                      meta: {
                        title: 'Data plane',
                        parent: 'data-plane-list-view',
                      },
                      component: () => import('@/data-planes/views/DataPlaneDetailView.vue'),
                    },
                  ],
                },
                {
                  path: 'internal-services',
                  children: [
                    {
                      path: '',
                      name: 'service-insight-list-view',
                      meta: {
                        title: 'Internal services',
                        breadcrumb: 'Internal services',
                      },
                      component: () => import('@/app/services/views/ServiceInsightListView.vue'),
                    },
                    {
                      path: ':service',
                      name: 'service-insight-detail-view',
                      meta: {
                        title: 'Internal service',
                        parent: 'service-insight-list-view',
                      },
                      component: () => import('@/app/services/views/ServiceInsightDetailView.vue'),
                    },
                  ],
                },
                {
                  path: 'external-services',
                  children: [
                    {
                      path: '',
                      name: 'external-service-list-view',
                      meta: {
                        title: 'External services',
                        breadcrumb: 'External services',
                      },
                      component: () => import('@/app/services/views/ExternalServiceListView.vue'),
                    },
                    {
                      path: ':service',
                      name: 'external-service-detail-view',
                      meta: {
                        title: 'External service',
                        parent: 'external-service-list-view',
                      },
                      component: () => import('@/app/services/views/ExternalServiceDetailView.vue'),
                    },
                  ],
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
      component: () => import('@/views/ShellEmpty.vue'),
      children: [
        {
          path: 'welcome',
          name: 'onboarding-welcome',
          meta: {
            title: `Welcome to ${import.meta.env.VITE_NAMESPACE}!`,
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/WelcomeView.vue'),
        },
        {
          path: 'deployment-types',
          name: 'onboarding-deployment-types',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/DeploymentTypes.vue'),
        },
        {
          path: 'configuration-types',
          name: 'onboarding-configuration-types',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/ConfigurationTypes.vue'),
        },
        {
          path: 'multi-zone',
          name: 'onboarding-multi-zone',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/MultiZoneView.vue'),
        },
        {
          path: 'create-mesh',
          name: 'onboarding-create-mesh',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/CreateMesh.vue'),
        },
        {
          path: 'add-services',
          name: 'onboarding-add-services',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/AddNewServices.vue'),
        },
        {
          path: 'add-services-code',
          name: 'onboarding-add-services-code',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/AddNewServicesCode.vue'),
        },
        {
          path: 'dataplanes-overview',
          name: 'onboarding-dataplanes-overview',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/DataplanesOverview.vue'),
        },
        {
          path: 'completed',
          name: 'onboarding-completed',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/views/Onboarding/CompletedView.vue'),
        },
      ],
    },
    {
      // Entity Wizard
      path: '/wizard',
      name: 'wizard',
      component: () => import('@/views/ShellWithHeader.vue'),
      children: [
        {
          path: 'mesh',
          name: 'create-mesh',
          meta: {
            title: 'Create a new Mesh',
            wizardProcess: true,
            hideStatus: true,
          },
          component: () => import('@/views/Wizard/views/Mesh.vue'),
        },
        {
          path: 'kubernetes-dataplane',
          name: 'kubernetes-dataplane',
          meta: {
            title: 'Create a new Dataplane on Kubernetes',
            wizardProcess: true,
            hideStatus: true,
          },
          component: () => import('@/views/Wizard/views/DataplaneKubernetes.vue'),
        },
        {
          path: 'universal-dataplane',
          name: 'universal-dataplane',
          meta: {
            title: 'Create a new Dataplane on Universal',
            wizardProcess: true,
            hideStatus: true,
          },
          component: () => import('@/views/Wizard/views/DataplaneUniversal.vue'),
        },
      ],
    },
  ]

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
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
