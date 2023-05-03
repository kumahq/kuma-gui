import { RouteRecordRaw } from 'vue-router'

import { getLastNumberParameter } from '@/router/getLastParameter'
import type { State } from '@/store/storeConfig'
import type { Store } from 'vuex'

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
        isBreadcrumb: true,
      },
      component: () => import('@/app/diagnostics/views/DiagnosticsView.vue'),
    },
    {
      path: '/zones',
      meta: {
        title: 'Zones',
        isBreadcrumb: true,
      },
      children: [
        {
          path: '',
          name: 'zone-list-view',
          meta: {
            title: 'Zones',
          },
          props: (route) => ({
            selectedZoneName: route.query.zone,
            offset: getLastNumberParameter(route.query.offset),
          }),
          component: () => import('@/app/zones/views/ZoneListView.vue'),
        },
        {
          path: ':zone',
          name: 'zone-detail-view',
          meta: {
            title: 'Zone',
            isBreadcrumb: true,
            breadcrumbTitleParam: 'zone',
          },
          component: () => import('@/app/zones/views/ZoneDetailView.vue'),
        },
      ],
    },
    {
      path: '/zone-ingresses',
      meta: {
        title: 'Zone Ingresses',
        isBreadcrumb: true,
      },
      children: [
        {
          path: '',
          name: 'zone-ingress-list-view',
          meta: {
            title: 'Zone Ingresses',
          },
          props: (route) => ({
            selectedZoneIngressName: route.query.zoneIngress,
            offset: getLastNumberParameter(route.query.offset),
          }),
          component: () => import('@/app/zones/views/ZoneIngressListView.vue'),
        },
        {
          path: ':zoneIngress',
          name: 'zone-ingress-detail-view',
          meta: {
            title: 'Zone Ingress',
            isBreadcrumb: true,
            breadcrumbTitleParam: 'zoneIngress',
          },
          component: () => import('@/app/zones/views/ZoneIngressDetailView.vue'),
        },
      ],
    },
    {
      path: '/zone-egresses',
      meta: {
        title: 'Zone Egresses',
        isBreadcrumb: true,
      },
      children: [
        {
          path: '',
          name: 'zone-egress-list-view',
          meta: {
            title: 'Zone Egresses',
          },
          props: (route) => ({
            selectedZoneEgressName: route.query.zoneEgress,
            offset: getLastNumberParameter(route.query.offset),
          }),
          component: () => import('@/app/zones/views/ZoneEgressListView.vue'),
        },
        {
          path: ':zoneEgress',
          name: 'zone-egress-detail-view',
          meta: {
            title: 'Zone Egress',
            isBreadcrumb: true,
            breadcrumbTitleParam: 'zoneEgress',
          },
          component: () => import('@/app/zones/views/ZoneEgressDetailView.vue'),
        },
      ],
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
          meta: {
            title: 'Gateways',
            isBreadcrumb: true,
          },
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
                isBreadcrumb: true,
                breadcrumbTitleParam: 'dataPlane',
              },
              component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
            },
          ],
        },
        {
          path: 'data-planes',
          meta: {
            title: 'Data plane proxies',
            isBreadcrumb: true,
          },
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
                isBreadcrumb: true,
                breadcrumbTitleParam: 'dataPlane',
              },
              component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
            },
          ],
        },
        {
          path: 'services',
          meta: {
            title: 'Services',
            isBreadcrumb: true,
          },
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
                isBreadcrumb: true,
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
          meta: {
            title: 'Policies',
            isBreadcrumb: true,
          },
          children: [
            {
              path: '',
              name: 'policies',
              meta: {
                title: 'Policies',
              },
              redirect: (to) => {
                let item = store.state.policyTypes.find((item) => {
                  if (!(item.name in store.state.sidebar.insights.mesh.policies)) {
                    return false
                  }

                  return store.state.sidebar.insights.mesh.policies[item.name] !== 0
                })

                if (item === undefined) {
                  item = store.state.policyTypes[0]
                }

                if (item === undefined) {
                  return { name: 'home' }
                }

                return {
                  ...to,
                  params: {
                    ...to.params,
                    policyPath: item.path,
                  },
                  name: 'policy-list-view',
                }
              },
            },
            {
              path: ':policyPath',
              meta: {
                isBreadcrumb: true,
                getBreadcrumbTitle: (route, store) => {
                  const policyType = store.state.policyTypesByPath[route.params.policyPath as string]

                  return policyType.name
                },
              },
              children: [
                {
                  path: '',
                  name: 'policy-list-view',
                  component: () => import('@/app/policies/views/PolicyListView.vue'),
                  props: (route) => ({
                    policyPath: route.params.policyPath,
                    selectedPolicyName: route.query.policy,
                    offset: getLastNumberParameter(route.query.offset),
                  }),
                },
                {
                  path: ':policy',
                  name: 'policy-detail-view',
                  meta: {
                    isBreadcrumb: true,
                    breadcrumbTitleParam: 'policy',
                  },
                  props: (route) => ({
                    mesh: route.params.mesh,
                    policyPath: route.params.policyPath,
                    policyName: route.params.policy,
                  }),
                  component: () => import('@/app/policies/views/PolicyDetailView.vue'),
                },
              ],
            },
          ],
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
          },
          component: () => import('@/app/wizard/views/MeshWizard.vue'),
        },
        {
          path: 'kubernetes-dataplane',
          name: 'kubernetes-dataplane',
          meta: {
            title: 'Create a new data plane proxy on Kubernetes',
          },
          component: () => import('@/app/wizard/views/DataplaneKubernetes.vue'),
        },
        {
          path: 'universal-dataplane',
          name: 'universal-dataplane',
          meta: {
            title: 'Create a new data plane proxy on Universal',
          },
          component: () => import('@/app/wizard/views/DataplaneUniversal.vue'),
        },
      ],
    },
  ]
}
