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
            path: `${prefix === 'policy' ? ':policyType/' : ''}:policy`,
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
                    policyType: 'CircuitBreaker',
                  },
                  name: 'policies-list-view',
                }
              },
              children: [
                {
                  path: ':policyType',
                  name: `${prefix}-list-view`,
                  component: () => import('@/app/policies/views/PolicyListView.vue'),
                  props: (route) => ({
                    policyType: route.params.policyType,
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
