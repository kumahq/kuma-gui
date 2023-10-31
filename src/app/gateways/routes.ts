import type { RouteRecordRaw } from 'vue-router'
export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'gateways/:dataPlane',
        name: 'gateway-detail-tabs-view',
        component: () => import('@/app/data-planes/views/DataPlaneDetailTabsView.vue'),
        props: {
          isGatewayView: true,
        },
        children: [
          {
            path: 'overview',
            name: 'gateway-detail-view',
            component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
          },
          {
            path: 'policies',
            name: 'gateway-policies-view',
            component: () => import('@/app/gateways/views/GatewayPoliciesView.vue'),
          },
          {
            path: 'xds-config',
            name: 'gateway-xds-config-view',
            component: () => import('@/app/data-planes/views/DataPlaneXdsConfigView.vue'),
          },
          {
            path: 'stats',
            name: 'gateway-stats-view',
            component: () => import('@/app/data-planes/views/DataPlaneStatsView.vue'),
          },
          {
            path: 'clusters',
            name: 'gateway-clusters-view',
            component: () => import('@/app/data-planes/views/DataPlaneClustersView.vue'),
          },
          {
            path: 'config',
            name: 'gateway-config-view',
            component: () => import('@/app/data-planes/views/DataPlaneConfigView.vue'),
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
          name: 'gateway-list-view',
          meta: {
            module: 'gateways',
          },
          component: () => import('@/app/gateways/views/GatewayListView.vue'),
        },
      ]
    },
    item,
  }
}
