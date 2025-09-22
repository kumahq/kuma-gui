import { routes as connections, networking } from '@/app/connections/routes'
import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const dataplaneRoutes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'data-planes/:proxy',
      name: 'data-plane-detail-tabs-view',
      component: () => import('@/app/data-planes/views/DataPlaneDetailTabsView.vue'),
      children: [
        {
          path: 'overview',
          name: 'data-plane-detail-view',
          component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
          children: [
            ...connections('data-plane').map(item => {
              if (item.name === 'data-plane-connection-inbound-summary-view' && item.children) {
                item.component = () => import('@/app/data-planes/views/DataPlaneTrafficSummaryView.vue')
                // temporarily exclude all children but overview
                // item.children = [{
                //   path: 'overview',
                //   name: 'data-plane-connection-inbound-summary-overview-view',
                //   component: () => import('@/app/data-planes/views/DataPlaneInboundSummaryOverviewView.vue'),
                // }]
                item.children.unshift(
                  {
                    path: 'overview',
                    name: 'data-plane-connection-inbound-summary-overview-view',
                    component: () => import('@/app/data-planes/views/DataPlaneInboundSummaryOverviewView.vue'),
                  },
                )
              }
              if (item.name === 'data-plane-connection-outbound-summary-view' && item.children) {
                item.component = () => import('@/app/data-planes/views/DataPlaneTrafficSummaryView.vue')
                // temporarily exclude all children but overview
                // item.children = [{
                //   path: 'overview',
                //   name: 'data-plane-connection-outbound-summary-overview-view',
                //   component: () => import('@/app/data-planes/views/DataPlaneOutboundSummaryOverviewView.vue'),
                // }]
                item.children.unshift(
                  {
                    path: 'overview',
                    name: 'data-plane-connection-outbound-summary-overview-view',
                    component: () => import('@/app/data-planes/views/DataPlaneOutboundSummaryOverviewView.vue'),
                  },
                )
              }
              return item
            }),
            {
              path: 'policy/:policy',
              name: 'data-plane-policy-config-summary-view',
              component: () => import('@/app/data-planes/views/DataplanePolicyConfigSummaryView.vue'),
            },
          ],
        },
        {
          path: 'config',
          name: 'data-plane-config-view',
          component: () => import('@/app/data-planes/views/DataPlaneConfigView.vue'),
        },
        ...networking('data-plane'),
        {
          path: 'subscriptions',
          name: 'data-plane-subscriptions-list-view',
          props: {
            routePrefix: 'data-plane',
            i18nPrefix: 'data-planes',
          },
          component: () => import('@/app/subscriptions/views/SubscriptionsListView.vue'),
          children: [...subscriptions('data-plane')],
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
      children: [...dataplaneRoutes()],
    },
  ]

  const summary = (prefix?: string): RouteRecordRaw[] => {
    const fullPrefix = prefix?.length ? `${prefix}-` : ''

    return [
      {
        path: ':proxy',
        name: `${fullPrefix}data-plane-summary-view`,
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
