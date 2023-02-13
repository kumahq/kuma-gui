import type { Store } from 'vuex'

import type { State } from '@/store/storeConfig'
import {
  RouteRecordRaw,
  RouteLocation,
  RouteLocationRaw,
} from 'vue-router'
import { getLastNumberParameter } from '@/router/getLastParameter'

export default (store: Store<State>): RouteRecordRaw[] => {
  return [
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
        selectedZoneName: route.query.zone,
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
        selectedZoneIngressName: route.query.zoneIngress,
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
        selectedZoneEgressName: route.query.zoneEgress,
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
                selectedDppName: route.query.gateway,
                gatewayType: route.query.gatewayType === 'all' ? 'true' : route.query.gatewayType,
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
                selectedDppName: route.query.dpp,
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
                selectedServiceName: route.query.service,
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
              props: (route) => ({
                selectedDppName: route.query.dpp,
              }),
              component: () => import('@/app/services/views/ServiceDetailView.vue'),
            },
          ],
        },
        {
          path: 'policies',
          name: 'policies',
          meta: {
            title: 'Policies',
          },
          redirect: (to: RouteLocation): RouteLocationRaw => {
            let item = store.state.policyTypes
              .find((item) => store.state.sidebar.insights.mesh.policies[item.name] !== 0)
            if (item === undefined) {
              item = store.state.policyTypes[0]
            }
            return {
              ...to,
              params: {
                ...to.params,
                policyPath: item.path,
              },
              name: 'policy',
            }
          },
        },
        {
          path: 'policies/:policyPath',
          name: 'policy',
          meta: {
            parent: 'policies',
          },
          component: () => import('@/app/policies/views/PolicyView.vue'),
          props: (route) => {
            const policy = store.state.policyTypesByPath[route.params.policyPath as string]

            route.meta.title = policy.name

            return {
              policyPath: route.params.policyPath,
              selectedPolicyName: route.query.policy,
              offset: getLastNumberParameter(route.query.offset),
            }
          },
        },
      ],
    },
    {
      path: '/onboarding',
      redirect: {
        name: 'onboarding-welcome',
      },
      component: () => import('@/app/onboarding/views/OnboardingView.vue'),
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
          component: () => import('@/app/wizard/views/MeshWizard.vue'),
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
}
