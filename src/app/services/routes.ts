import type { Can } from '@/app/application/services/can'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (can: Can) => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'services',
        name: 'service-detail-index-view',
        children: [
          {
            path: 'internal/:service',
            name: 'service-detail-tabs-view',
            component: () => import('@/app/services/views/ServiceDetailTabsView.vue'),
            children: [
              {
                path: 'overview',
                name: 'service-detail-view',
                component: () => import('@/app/services/views/ServiceDetailView.vue'),
                children: [
                  {
                    path: ':dataPlane',
                    name: 'service-data-plane-summary-view',
                    component: () => import('@/app/data-planes/views/DataPlaneSummaryView.vue'),
                  },
                ],
              },
            ],
          },
          {
            path: 'external/:service',
            name: 'external-service-detail-tabs-view',
            component: () => import('@/app/external-services/views/ExternalServiceDetailTabsView.vue'),
            children: [
              {
                path: 'overview',
                name: 'external-service-detail-view',
                component: () => import('@/app/external-services/views/ExternalServiceDetailView.vue'),
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
          path: 'services',
          name: 'service-list-tabs-view',
          redirect: { name: 'service-list-view' },
          meta: {
            module: 'services',
          },
          component: () => import('@/app/services/views/ServiceListTabsView.vue'),
          children: [
            ...(can('use meshservice')
              ? [
                {
                  path: 'mesh-service',
                  name: 'mesh-service-list-view',
                  component: () => import('@/app/services/views/ServiceListView.vue'),
                },
                {
                  path: 'mesh-external-service',
                  name: 'mesh-external-service-list-view',
                  component: () => import('@/app/services/views/ServiceListView.vue'),
                },
              ]
              : []),
            {
              path: 'internal',
              name: 'service-list-view',
              component: () => import('@/app/services/views/ServiceListView.vue'),
            },
            {
              path: 'external',
              name: 'external-service-list-view',
              component: () => import('@/app/external-services/views/ExternalServiceListView.vue'),
            },
          ],
        },
      ]
    },
    item,
  }
}
