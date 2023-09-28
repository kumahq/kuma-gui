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
          },
          {
            path: 'policies',
            name: 'data-plane-policies-view',
            component: () => import('@/app/data-planes/views/DataPlanePoliciesView.vue'),
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

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'data-planes',
          name: 'data-plane-list-view',
          meta: {
            module: 'data-planes',
          },
          component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
        },
      ]
    },
    item,
  }
}
