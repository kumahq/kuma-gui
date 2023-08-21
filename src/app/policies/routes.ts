import { PAGE_SIZE_DEFAULT } from '@/constants'
import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (prefix: string = 'policy'): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        name: `${prefix}-abstract-view`,
        meta: {
          module: 'policies',
        },
        redirect: () => ({ name: 'policies' }),
        children: [
          {
            path: `${prefix === 'policy' ? ':policyPath/' : ''}:policy`,
            name: `${prefix}-detail-view`,
            component: () => import('@/app/policies/views/PolicyDetailView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (prefix: string = 'policies'): RouteRecordRaw[] => {
      return [
        {
          path: `${prefix}`,
          name: `${prefix}-abstract-view`,
          meta: {
            module: 'policies',
          },
          redirect: () => ({ name: 'policies' }),
          children: [
            {
              path: '',
              name: `${prefix}`,
              redirect: (to) => {
                return {
                  ...to,
                  params: {
                    ...to.params,
                    policyPath: 'circuit-breakers',
                  },
                  name: 'policies-list-view',
                }
              },
              children: [
                {
                  path: ':policyPath',
                  name: `${prefix}-list-view`,
                  component: () => import('@/app/policies/views/PolicyListView.vue'),
                  props: (route) => ({
                    page: getLastNumberParameter(route.query.page, 1),
                    size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
                  }),
                  // children: [
                  //   ...(item(prefix)[0]).children ?? [],
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
