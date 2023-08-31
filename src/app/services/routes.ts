import { PAGE_SIZE_DEFAULT } from '@/constants'
import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (prefix: string = ''): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        name: `${prefix}-abstract-view`,
        meta: {
          module: 'services',
        },
        redirect: () => ({ name: 'services-list-view' }),
        children: [
          {
            path: ':service',
            name: `${prefix}-detail-tabs-view`,
            component: () => import('@/app/services/views/ServiceDetailTabsView.vue'),
            children: [
              {
                path: '',
                name: `${prefix}-detail-view`,
                component: () => import('@/app/services/views/ServiceDetailView.vue'),
              },
              {
                path: 'config',
                name: `${prefix}-config-view`,
                component: () => import('@/app/services/views/ServiceConfigView.vue'),
              },
              {
                path: 'data-plane-proxies',
                name: `${prefix}-data-plane-proxies-view`,
                component: () => import('@/app/services/views/ServiceDataPlaneProxiesView.vue'),
                props: (route) => ({
                  gatewayType: route.query.gatewayType || 'all',
                  page: getLastNumberParameter(route.query.page, 1),
                  size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
                  query: decodeURIComponent(String(route.query.query || '')),
                  search: decodeURIComponent(String(route.query.s || '')),
                }),
              },
            ],
          },
        ],
      },
    ]
  }

  return {
    items: (prefix: string = 'services'): RouteRecordRaw[] => {
      return [
        {
          path: `${prefix}`,
          name: `${prefix}-abstract-view`,
          meta: {
            module: 'services',
          },
          redirect: () => ({ name: 'services-list-view' }),
          children: [
            {
              path: '',
              name: `${prefix}-list-view`,
              props: (route) => ({
                mesh: route.params.mesh,
                page: getLastNumberParameter(route.query.page, 1),
                size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
              }),
              component: () => import('@/app/services/views/ServiceListView.vue'),
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
