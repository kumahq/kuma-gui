import { routes as dataPlanes } from '@/app/data-planes/routes'
import type { Can } from '@kumahq/settings/can'
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
                children: dataPlanes().summary('service'),
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
          {
            path: 'mesh-services/:service',
            name: 'mesh-service-detail-tabs-view',
            component: () => import('@/app/services/views/MeshServiceDetailTabsView.vue'),
            children: [
              {
                path: 'overview',
                name: 'mesh-service-detail-view',
                component: () => import('@/app/services/views/MeshServiceDetailView.vue'),
                children: dataPlanes().summary('mesh-service'),
              },
              {
                path: 'config',
                name: 'mesh-service-config-view',
                component: () => import('@/app/services/views/MeshServiceConfigView.vue'),
              },
            ],
          },
          ...(can('use zones')
            ? [
              {
                path: 'mesh-multi-zone-services/:service',
                name: 'mesh-multi-zone-service-detail-tabs-view',
                component: () => import('@/app/services/views/MeshMultiZoneServiceDetailTabsView.vue'),
                children: [
                  {
                    path: 'overview',
                    name: 'mesh-multi-zone-service-detail-view',
                    component: () => import('@/app/services/views/MeshMultiZoneServiceDetailView.vue'),
                    children: dataPlanes().summary('mesh-multi-zone-service'),
                  },
                ],
              },
            ]
            : []),
          {
            path: 'mesh-external-services/:service',
            name: 'mesh-external-service-detail-tabs-view',
            component: () => import('@/app/services/views/MeshExternalServiceDetailTabsView.vue'),
            children: [
              {
                path: 'overview',
                name: 'mesh-external-service-detail-view',
                component: () => import('@/app/services/views/MeshExternalServiceDetailView.vue'),
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
          component: () => import('@/app/services/views/ServiceListTabsView.vue'),
          children: [
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
            {
              path: 'mesh-services',
              name: 'mesh-service-list-view',
              component: () => import('@/app/services/views/MeshServiceListView.vue'),
              children: [
                {
                  path: ':service',
                  name: 'mesh-service-summary-view',
                  component: () => import('@/app/services/views/MeshServiceSummaryView.vue'),
                },
              ],
            },
            ...(can('use zones')
              ? [
                {
                  path: 'mesh-multi-zone-services',
                  name: 'mesh-multi-zone-service-list-view',
                  component: () => import('@/app/services/views/MeshMultiZoneServiceListView.vue'),
                  children: [
                    {
                      path: ':service',
                      name: 'mesh-multi-zone-service-summary-view',
                      component: () => import('@/app/services/views/MeshMultiZoneServiceSummaryView.vue'),
                    },
                  ],
                },
              ]
              : []),
            {
              path: 'mesh-external-services',
              name: 'mesh-external-service-list-view',
              component: () => import('@/app/services/views/MeshExternalServiceListView.vue'),
              children: [
                {
                  path: ':service',
                  name: 'mesh-external-service-summary-view',
                  component: () => import('@/app/services/views/MeshExternalServiceSummaryView.vue'),
                },
              ],
            },
          ],
        },
      ]
    },
    item,
  }
}
