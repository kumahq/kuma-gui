import {
  createRouter as createVueRouter,
  createWebHistory,
  NavigationGuard,
  Router,
  RouteRecordRaw,
  RouteLocation,
  RouteLocationRaw,
} from 'vue-router'

import { getLastNumberParameter } from './getLastParameter'
import { store } from '@/store/store'
import { PolicyDefinition } from '@/types/index.d'
import { ClientStorage } from '@/utilities/ClientStorage'

function getPolicyRoutes(policies: PolicyDefinition[]): RouteRecordRaw[] {
  return policies.map((policy) => {
    return {
      path: policy.path,
      name: policy.path,
      meta: {
        title: policy.pluralDisplayName,
      },
      props: (route) => ({
        policyPath: policy.path,
        offset: getLastNumberParameter(route.query.offset),
      }),
      component: () => import('@/app/policies/views/PolicyView.vue'),
    }
  })
}

export function createRouter(baseGuiPath: string = '/', policyDefinitions: PolicyDefinition[] = []): Router {
  const policyRoutes = getPolicyRoutes(policyDefinitions)

  const routes: readonly RouteRecordRaw[] = [
    {
      path: '/404',
      name: 'not-found',
      alias: '/:pathMatch(.*)*',
      meta: {
        title: 'Item not found',
      },
      component: () => import('@/app/AppNotFoundView.vue'),
    },
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'Overview',
      },
      component: () => import('@/app/main-overview/views/MainOverviewView.vue'),
    },
    {
      path: '/diagnostics',
      name: 'diagnostics',
      meta: {
        title: 'Diagnostics',
      },
      component: () => import('@/app/diagnostics/views/DiagnosticsView.vue'),
    },
    {
      path: '/zones',
      name: 'zones',
      meta: {
        title: 'Zones',
      },
      props: (route) => ({
        offset: getLastNumberParameter(route.query.offset),
      }),
      component: () => import('@/app/zones/views/ZonesView.vue'),
    },
    {
      path: '/zone-ingresses',
      name: 'zoneingresses',
      meta: {
        title: 'Zone ingresses',
      },
      props: (route) => ({
        offset: getLastNumberParameter(route.query.offset),
      }),
      component: () => import('@/app/zones/views/ZoneIngresses.vue'),
    },
    {
      path: '/zoneegresses',
      name: 'zoneegresses',
      meta: {
        title: 'Zone egresses',
      },
      props: (route) => ({
        offset: getLastNumberParameter(route.query.offset),
      }),
      component: () => import('@/app/zones/views/ZoneEgresses.vue'),
    },
    {
      path: '/mesh/:mesh',
      children: [
        {
          path: '',
          name: 'mesh-detail-view',
          meta: {
            title: 'Mesh overview',
          },
          component: () => import('@/app/mesh-overview/views/MeshOverviewView.vue'),
        },
        {
          path: 'gateways',
          children: [
            {
              path: '',
              name: 'gateway-list-view',
              meta: {
                title: 'Gateways',
              },
              props: (route) => ({
                name: route.query.name,
                offset: getLastNumberParameter(route.query.offset),
                isGatewayView: true,
              }),
              component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
            },
            {
              path: ':dataPlane',
              name: 'gateway-detail-view',
              meta: {
                title: 'Gateway',
                parent: 'gateway-list-view',
                breadcrumbTitleParam: 'dataPlane',
              },
              component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
            },
          ],
        },
        {
          path: 'data-planes',
          children: [
            {
              path: '',
              name: 'data-plane-list-view',
              meta: {
                title: 'Data plane proxies',
              },
              props: (route) => ({
                name: route.query.name,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
            },
            {
              path: ':dataPlane',
              name: 'data-plane-detail-view',
              meta: {
                title: 'Data plane proxy',
                parent: 'data-plane-list-view',
                breadcrumbTitleParam: 'dataPlane',
              },
              component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
            },
          ],
        },
        {
          path: 'services',
          children: [
            {
              path: '',
              name: 'service-list-view',
              meta: {
                title: 'Services',
              },
              props: (route) => ({
                name: route.query.name,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/services/views/ServiceListView.vue'),
            },
            {
              path: ':service',
              name: 'service-detail-view',
              meta: {
                title: 'Internal service',
                parent: 'service-list-view',
                breadcrumbTitleParam: 'service',
              },
              component: () => import('@/app/services/views/ServiceDetailView.vue'),
            },
          ],
        },
        {
          path: 'policies',
          name: 'policies',
          redirect: (to: RouteLocation): RouteLocationRaw => {
            let item = store.state.policies
              .find((item) => store.state.sidebar.insights.mesh.policies[item.name] !== 0)
            if (item === undefined) {
              item = store.state.policies[0]
            }
            return {
              ...to,
              name: item.path,
            }
          },
        },
        ...policyRoutes,
      ],
    },
    {
      path: '/onboarding',
      redirect: {
        name: 'onboarding-welcome',
      },
      component: () => import('@/app/onboarding/views/ShellEmpty.vue'),
      children: [
        {
          path: 'welcome',
          name: 'onboarding-welcome',
          meta: {
            title: `Welcome to ${import.meta.env.VITE_NAMESPACE}!`,
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/WelcomeView.vue'),
        },
        {
          path: 'deployment-types',
          name: 'onboarding-deployment-types',
          meta: {
            title: 'Deployment Types',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/DeploymentTypes.vue'),
        },
        {
          path: 'configuration-types',
          name: 'onboarding-configuration-types',
          meta: {
            title: 'Configuration Types',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/ConfigurationTypes.vue'),
        },
        {
          path: 'multi-zone',
          name: 'onboarding-multi-zone',
          meta: {
            title: 'Multizone',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/MultiZoneView.vue'),
        },
        {
          path: 'create-mesh',
          name: 'onboarding-create-mesh',
          meta: {
            title: 'Create the Mesh',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/CreateMesh.vue'),
        },
        {
          path: 'add-services',
          name: 'onboarding-add-services',
          meta: {
            title: 'Add new services',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/AddNewServices.vue'),
        },
        {
          path: 'add-services-code',
          name: 'onboarding-add-services-code',
          meta: {
            title: 'Add new services',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/AddNewServicesCode.vue'),
        },
        {
          path: 'dataplanes-overview',
          name: 'onboarding-dataplanes-overview',
          meta: {
            title: 'Data plane overview',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/DataplanesOverview.vue'),
        },
        {
          path: 'completed',
          name: 'onboarding-completed',
          meta: {
            title: 'Completed',
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/CompletedView.vue'),
        },
      ],
    },
    {
      path: '/wizard',
      name: 'wizard',
      children: [
        {
          path: 'mesh',
          name: 'create-mesh',
          meta: {
            title: 'Create a new mesh',
            wizardProcess: true,
          },
          component: () => import('@/app/wizard/views/Mesh.vue'),
        },
        {
          path: 'kubernetes-dataplane',
          name: 'kubernetes-dataplane',
          meta: {
            title: 'Create a new data plane proxy on Kubernetes',
            wizardProcess: true,
          },
          component: () => import('@/app/wizard/views/DataplaneKubernetes.vue'),
        },
        {
          path: 'universal-dataplane',
          name: 'universal-dataplane',
          meta: {
            title: 'Create a new data plane proxy on Universal',
            wizardProcess: true,
          },
          component: () => import('@/app/wizard/views/DataplaneUniversal.vue'),
        },
      ],
    },
  ]

  const router = createVueRouter({
    history: createWebHistory(baseGuiPath),
    routes,
  })

  router.beforeEach(redirectOldHashHistoryUrlPaths)
  router.beforeEach(updateSelectedMeshGuard)
  router.beforeEach(onboardingRouteGuard)

  return router
}

/**
 * Redirects navigations to old hash history-style URL paths.
 */
const redirectOldHashHistoryUrlPaths: NavigationGuard = function (to, _from, next) {
  if (to.fullPath.startsWith('/#/')) {
    next(to.fullPath.substring(2))
  } else {
    next()
  }
}

/**
 * Updates `state.selectedMesh` when navigating to a page associated to a different mesh.
 */
const updateSelectedMeshGuard: NavigationGuard = function (to, _from, next) {
  if (to.params.mesh && to.params.mesh !== store.state.selectedMesh) {
    store.dispatch('updateSelectedMesh', to.params.mesh)
  }

  next()
}

/**
 * Redirects the user to the appropriate onboarding view if they haven’t completed it, yet.
 *
 * Redirects the user to the home view if they’re navigating to an onboarding route while having already completed onboarding. An exception is made when we suggest onboarding for users who don’t have data plane proxies, yet (we show an alert suggesting it and allow going to the onboarding again).
 */
const onboardingRouteGuard: NavigationGuard = function (to, _from, next) {
  const isOnboardingCompleted = store.state.onboarding.isCompleted
  const isOnboardingRoute = to.meta.onboardingProcess
  const shouldSuggestOnboarding = store.getters['onboarding/showOnboarding']

  if (isOnboardingCompleted && isOnboardingRoute && !shouldSuggestOnboarding) {
    next({ name: 'home' })
  } else if (!isOnboardingCompleted && !isOnboardingRoute && shouldSuggestOnboarding) {
    next({ name: ClientStorage.get('onboardingStep') ?? 'onboarding-welcome' })
  } else {
    next()
  }
}
