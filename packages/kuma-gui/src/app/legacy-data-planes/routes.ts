import { meshIdentityRoutes } from '../resources/routes'
import { routes as connections, networking } from '@/app/connections/routes'
import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const legacyDataplaneRoutes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'data-planes/:proxy',
      name: 'data-plane-detail-tabs-view',
      component: () => import('@/app/legacy-data-planes/views/DataPlaneDetailTabsView.vue'),
      children: [
        {
          path: 'overview',
          name: 'data-plane-detail-view',
          component: () => import('@/app/legacy-data-planes/views/DataPlaneDetailView.vue'),
          children: [
            ...connections('data-plane').map(item => {
              if (item.name === 'data-plane-connection-inbound-summary-view' && item.children) {
                item.children.unshift(
                  {
                    path: 'overview',
                    name: 'data-plane-connection-inbound-summary-overview-view',
                    component: () => import('@/app/legacy-data-planes/views/DataPlaneInboundSummaryOverviewView.vue'),
                  },
                )
              }
              if (item.name === 'data-plane-connection-outbound-summary-view' && item.children) {
                item.children.unshift(
                  {
                    path: 'overview',
                    name: 'data-plane-connection-outbound-summary-overview-view',
                    component: () => import('@/app/legacy-data-planes/views/DataPlaneOutboundSummaryOverviewView.vue'),
                  },
                )
              }
              return item
            }),
            {
              path: 'subscriptions',
              name: 'data-plane-subscriptions-summary-view',
              component: () => import('@/app/data-planes/views/DataPlaneSubscriptionsSummaryView.vue'),
              children: [...subscriptions('data-plane')],
            },

            /**
             * The legacy data planes are not using the policy config summary view, but the router requires
             * the route to be defined, otherwise a deep-link would always lead to the /404 route.
             * In order to allow deep-linking to the policy config summary view in case the dp has `feature-unified-resource-naming` enabled,
             * we define the route here, but it will never be used in the legacy data planes.
             * The actual handling of this happens in the `DataPlaneRouteGuard: router.beforeResolve`.
             */
            {
              path: 'policy/:policy',
              name: 'data-plane-policy-config-summary-view',
              component: () => import('@/app/data-planes/views/DataplanePolicyConfigSummaryView.vue'),
            },
            ...meshIdentityRoutes('data-plane'),
          ],
        },
        {
          path: 'policies',
          name: 'data-plane-policies-view',
          component: () => import('@/app/legacy-data-planes/views/DataPlanePoliciesView.vue'),
          children: [
            {
              path: ':policyPath/:policy',
              name: 'data-plane-policy-summary-view',
              component: () => import('@/app/legacy-data-planes/views/DataPlanePolicySummaryView.vue'),
            },
          ],
        },
        ...networking('data-plane'),
        {
          path: 'config',
          name: 'data-plane-config-view',
          component: () => import('@/app/legacy-data-planes/views/DataPlaneConfigView.vue'),
        },
      ],
    },
  ]
}

export const routes = () => {
  const item = (): RouteRecordRaw[] => [
    {
      path: '',
      name: 'data-plane-root-view',
      component: () => import('@/app/legacy-data-planes/views/RootView.vue'),
      children: [...legacyDataplaneRoutes()],
    },
  ]

  const summary = (prefix?: string): RouteRecordRaw[] => {
    const fullPrefix = prefix?.length ? `${prefix}-` : ''

    return [
      {
        path: ':proxy',
        name: `${fullPrefix}data-plane-summary-view`,
        component: () => import('@/app/legacy-data-planes/views/DataPlaneSummaryView.vue'),
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'data-planes',
          name: 'data-plane-list-view',
          component: () => import('@/app/legacy-data-planes/views/DataPlaneListView.vue'),
          children: summary(),
        },
      ]
    },
    item,
    summary,
  }
}