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
