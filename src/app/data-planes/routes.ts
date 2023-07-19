import { PAGE_SIZE_DEFAULT } from '@/constants'
import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'
export const routes = () => {
  const item = (prefix: string = 'data-plane'): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        name: `${prefix}-abstract-view`,
        meta: {
          module: 'data-planes',
        },
        redirect: () => ({ name: 'data-planes-list-view' }),
        children: [
          {
            path: ':dataPlane',
            name: `${prefix}-detail-view`,
            component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (prefix: string = 'data-planes'): RouteRecordRaw[] => {
      return [
        {
          path: `${prefix}`,
          name: `${prefix}-abstract-view`,
          meta: {
            module: 'data-planes',
          },
          redirect: () => ({ name: 'data-planes-list-view' }),
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
              }),
              component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
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
