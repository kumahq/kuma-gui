import { routes as dataPlanes } from '@/app/legacy-data-planes/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'internal/:service',
        name: 'service-detail-tabs-view',
        component: () => import('@/app/legacy-services/views/ServiceDetailTabsView.vue'),
        children: [
          {
            path: 'overview',
            name: 'service-detail-view',
            component: () => import('@/app/legacy-services/views/ServiceDetailView.vue'),
            children: dataPlanes().summary('service'),
          },
        ],
      },
      {
        path: 'external/:service',
        name: 'external-service-detail-tabs-view',
        component: () => import('@/app/legacy-services/views/ExternalServiceDetailTabsView.vue'),
        children: [
          {
            path: 'overview',
            name: 'external-service-detail-view',
            component: () => import('@/app/legacy-services/views/ExternalServiceDetailView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'internal',
          name: 'service-list-view',
          component: () => import('@/app/legacy-services/views/ServiceListView.vue'),
        },
        {
          path: 'external',
          name: 'external-service-list-view',
          component: () => import('@/app/legacy-services/views/ExternalServiceListView.vue'),
        },
      ]
    },
    item,
  }
}
