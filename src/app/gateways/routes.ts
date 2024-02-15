import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'gateways',
        name: 'gateway-detail-view',
        children: [
          {
            path: 'builtin/:gateway',
            name: 'builtin-gateway-detail-tabs-view',
            component: () => import('@/app/gateways/views/BuiltinGatewayDetailTabsView.vue'),
            children: [
              {
                path: 'overview',
                name: 'builtin-gateway-detail-view',
                component: () => import('@/app/gateways/views/BuiltinGatewayDetailView.vue'),
              },
            ],
          },
          {
            path: 'delegated/:service',
            name: 'delegated-gateway-detail-tabs-view',
            component: () => import('@/app/gateways/views/DelegatedGatewayDetailTabsView.vue'),
            children: [
              {
                path: 'overview',
                name: 'delegated-gateway-detail-view',
                component: () => import('@/app/gateways/views/DelegatedGatewayDetailView.vue'),
              },
              {
                path: 'data-plane-proxies',
                name: 'delegated-gateway-data-plane-proxies-view',
                meta: {
                  module: 'delegated-gateway-data-planes',
                },
                component: () => import('@/app/gateways/views/DelegatedGatewayDataPlaneProxiesView.vue'),
                children: [
                  {
                    path: ':dataPlane',
                    name: 'delegated-gateway-data-plane-summary-view',
                    component: () => import('@/app/data-planes/views/DataPlaneSummaryView.vue'),
                  },
                ],
              },
            ],
          },
        ],
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'gateways',
          name: 'gateway-list-tabs-view',
          redirect: { name: 'builtin-gateway-list-view' },
          meta: {
            module: 'gateways',
          },
          component: () => import('@/app/gateways/views/GatewayListTabsView.vue'),
          children: [
            {
              path: 'builtin',
              name: 'builtin-gateway-list-view',
              component: () => import('@/app/gateways/views/BuiltinGatewayListView.vue'),
            },
            {
              path: 'delegated',
              name: 'delegated-gateway-list-view',
              component: () => import('@/app/gateways/views/DelegatedGatewayListView.vue'),
            },
          ],
        },
      ]
    },
    item,
  }
}
