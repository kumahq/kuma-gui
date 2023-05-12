import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'
export const routes = () => {
  const item = (prefix: string = 'gateway'): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        meta: {
          title: 'Gateways',
          isBreadcrumb: true,
        },
        children: [
          {
            path: ':dataPlane',
            name: `${prefix}-detail-view`,
            meta: {
              title: 'Gateway',
            },
            component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (prefix: string = 'gateways'): RouteRecordRaw[] => {
      return [
        {
          path: `${prefix}`,
          children: [
            {
              path: '',
              children: [
                {
                  path: '',
                  name: `${prefix}-list-view`,
                  meta: {
                    title: 'Gateways',
                    isBreadcrumb: true,
                  },
                  props: (route) => ({
                    selectedDppName: route.query.gateway,
                    gatewayType: route.query.gatewayType === 'all' ? 'true' : route.query.gatewayType,
                    offset: getLastNumberParameter(route.query.offset),
                    isGatewayView: true,
                  }),
                  component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
                  // children: [
                  //   ...item(prefix),
                  // ],
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
