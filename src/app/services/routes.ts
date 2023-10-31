import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'services/:service',
        name: 'service-detail-tabs-view',
        component: () => import('@/app/services/views/ServiceDetailTabsView.vue'),
        children: [
          {
            path: 'overview',
            name: 'service-detail-view',
            component: () => import('@/app/services/views/ServiceDetailView.vue'),
          },
          {
            path: 'config',
            name: 'service-config-view',
            component: () => import('@/app/services/views/ServiceConfigView.vue'),
          },
          {
            path: 'data-plane-proxies',
            name: 'service-data-plane-proxies-view',
            component: () => import('@/app/services/views/ServiceDataPlaneProxiesView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'services',
          name: 'service-list-view',
          meta: {
            module: 'services',
          },
          component: () => import('@/app/services/views/ServiceListView.vue'),
          children: [
            {
              path: ':service',
              name: 'service-summary-view',
              component: () => import('@/app/services/views/ServiceSummaryView.vue'),
            },
          ],
        },
      ]
    },
    item,
  }
}
