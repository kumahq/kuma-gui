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
