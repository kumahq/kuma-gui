import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'external-services/:service',
        name: 'external-service-detail-tabs-view',
        component: () => import('@/app/external-services/views/ExternalServiceDetailTabsView.vue'),
        children: [
          {
            path: 'overview',
            name: 'external-service-detail-view',
            component: () => import('@/app/external-services/views/ExternalServiceDetailView.vue'),
          },
          {
            path: 'config',
            name: 'external-service-config-view',
            component: () => import('@/app/external-services/views/ExternalServiceConfigView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'external-services',
          name: 'external-service-list-view',
          meta: {
            module: 'external-services',
          },
          component: () => import('@/app/external-services/views/ExternalServiceListView.vue'),
        },
      ]
    },
    item,
  }
}
