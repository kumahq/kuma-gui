import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'policies/:policyPath/:policy/overview',
        name: 'policy-detail-view',
        component: () => import('@/app/policies/views/PolicyDetailView.vue'),
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'policies',
          name: 'policy-list-index-view',
          meta: {
            module: 'policies',
          },
          redirect: (to) => {
            return {
              ...to,
              params: {
                ...to.params,
                policyPath: 'circuit-breakers',
              },
              name: 'policy-list-view',
            }
          },
          children: [
            {
              path: ':policyPath',
              name: 'policy-list-view',
              component: () => import('@/app/policies/views/PolicyListView.vue'),
              children: [
                {
                  path: ':policy',
                  name: 'policy-summary-view',
                  component: () => import('@/app/policies/views/PolicySummaryView.vue'),
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
