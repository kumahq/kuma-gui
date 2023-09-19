import type { RouteRecordRaw } from 'vue-router'
export const routes = () => {
  const item = (prefix: string = 'data-plane'): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        name: `${prefix}-abstract-view`,
        meta: {
          module: 'data-planes',
        },
        redirect: () => ({ name: 'data-planes-list-view' }),
        children: [
          {
            path: ':dataPlane',
            name: `${prefix}-detail-tabs-view`,
            component: () => import('@/app/data-planes/views/DataPlaneDetailTabsView.vue'),
            children: [
              {
                path: '',
                name: `${prefix}-detail-view`,
                component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
              },
              {
                path: 'policies',
                name: `${prefix}-policies-view`,
                component: () => import('@/app/data-planes/views/DataPlanePoliciesView.vue'),
              },
              {
                path: 'xds-config',
                name: `${prefix}-xds-config-view`,
                component: () => import('@/app/data-planes/views/DataPlaneXdsConfigView.vue'),
              },
              {
                path: 'stats',
                name: `${prefix}-stats-view`,
                component: () => import('@/app/data-planes/views/DataPlaneStatsView.vue'),
              },
              {
                path: 'clusters',
                name: `${prefix}-clusters-view`,
                component: () => import('@/app/data-planes/views/DataPlaneClustersView.vue'),
              },
              {
                path: 'config',
                name: `${prefix}-config-view`,
                component: () => import('@/app/data-planes/views/DataPlaneConfigView.vue'),
              },
            ],
          },
        ],
      },
    ]
  }

  return {
    items: (prefix: string = 'data-planes'): RouteRecordRaw[] => {
      return [
        {
          path: `${prefix}`,
          name: `${prefix}-abstract-view`,
          meta: {
            module: 'data-planes',
          },
          redirect: () => ({ name: 'data-planes-list-view' }),
          children: [
            {
              path: '',
              name: `${prefix}-list-view`,
              component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
              // children: [
              //   ...(item(prefix)[0]).children ?? [],
              // ],
            },
          ],
        },
      ]
    },
    item,
  }
}
