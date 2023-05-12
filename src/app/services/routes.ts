import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (prefix: string = ''): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        meta: {
          title: 'Services',
          isBreadcrumb: true,
        },
        children: [
          {
            path: ':service',
            name: `${prefix}-detail-view`,
            meta: {
              title: 'Internal service',
            },
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
              children: [
                {
                  path: '',
                  name: `${prefix}-list-view`,
                  meta: {
                    title: 'Services',
                  },
                  props: (route) => ({
                    selectedServiceName: route.query.service,
                    offset: getLastNumberParameter(route.query.offset),
                  }),
                  component: () => import('@/app/services/views/ServiceListView.vue'),
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
