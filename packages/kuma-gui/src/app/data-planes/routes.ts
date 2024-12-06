import { routes as connections } from '@/app/connections/routes'
import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'data-planes/:dataPlane',
        name: 'data-plane-detail-tabs-view',
        component: () => import('@/app/data-planes/views/DataPlaneDetailTabsView.vue'),
        children: [
          {
            path: 'overview',
            name: 'data-plane-detail-view',
            component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
            children: [
              ...connections(),
              ...subscriptions('data-plane'),
            ],
          },
          {
            path: 'policies',
            name: 'data-plane-policies-view',
            component: () => import('@/app/data-planes/views/DataPlanePoliciesView.vue'),
            children: [
              {
                path: ':policyPath/:policy',
                name: 'data-plane-policy-summary-view',
                component: () => import('@/app/data-planes/views/DataPlanePolicySummaryView.vue'),
              },
            ],
          },
          {
            path: 'xds-config',
            name: 'data-plane-xds-config-view',
            component: () => import('@/app/data-planes/views/DataPlaneXdsConfigView.vue'),
          },
          {
            path: 'stats',
            name: 'data-plane-stats-view',
            component: () => import('@/app/data-planes/views/DataPlaneStatsView.vue'),
          },
          {
            path: 'clusters',
            name: 'data-plane-clusters-view',
            component: () => import('@/app/data-planes/views/DataPlaneClustersView.vue'),
          },
          {
            path: 'config',
            name: 'data-plane-config-view',
            component: () => import('@/app/data-planes/views/DataPlaneConfigView.vue'),
          },
        ],
      },
    ]
  }

  const summary = (prefix?: string): RouteRecordRaw[] => {
    const fullPrefix = prefix?.length ? `${prefix}-` : ''

    return [
      {
        path: ':dataPlane',
        name: `${fullPrefix}data-plane-summary-view`,
        props: () => ({
          routeName: `${fullPrefix}data-plane-summary-view`,
        }),
        component: () => import('@/app/data-planes/views/DataPlaneSummaryView.vue'),
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'data-planes',
          name: 'data-plane-list-view',
          component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
          children: summary(),
        },
      ]
    },
    item,
    summary,
  }
}
