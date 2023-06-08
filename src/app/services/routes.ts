import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (prefix: string = ''): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        name: `${prefix}-abstract-view`,
        redirect: () => ({ name: 'services-list-view' }),
        children: [
          {
            path: ':service',
            name: `${prefix}-detail-view`,
            component: () => import('@/app/services/views/ServiceDetailView.vue'),
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
          children: [
            {
              path: '',
              name: `${prefix}-list-view`,
              props: (route) => ({
                selectedServiceName: route.query.service,
                offset: getLastNumberParameter(route.query.offset),
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
