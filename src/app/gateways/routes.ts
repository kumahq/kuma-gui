import { PAGE_SIZE_DEFAULT } from '@/constants'
import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'
export const routes = () => {
  const item = (prefix: string = 'gateway'): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        name: `${prefix}-abstract-view`,
        meta: {
          module: 'gateways',
        },
        redirect: () => ({ name: 'gateways-list-view' }),
        children: [
          {
            path: ':dataPlane',
            name: `${prefix}-detail-view`,
            props: () => ({
              isGatewayView: true,
            }),
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
          name: `${prefix}-abstract-view`,
          meta: {
            module: 'gateways',
          },
          redirect: () => ({ name: 'gateways-list-view' }),
          children: [
            {
              path: '',
              name: `${prefix}-list-view`,
              props: (route) => ({
                mesh: route.params.mesh,
                page: getLastNumberParameter(route.query.page, 1),
                size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
                query: decodeURIComponent(String(route.query.query || '')),
                search: decodeURIComponent(String(route.query.s || '')),
                gatewayType: route.query.gatewayType || 'all',
              }),
              component: () => import('@/app/gateways/views/GatewayListView.vue'),
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
