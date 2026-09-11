import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'policies/:policy',
        name: 'policy-detail-tabs-view',
        component: () => import('@/app/policies/views/PolicyDetailTabsView.vue'),
        children: [
          {
            path: 'overview',
            name: 'policy-detail-view',
            component: () => import('@/app/policies/views/PolicyDetailView.vue'),
          },
          {
            path: 'config',
            name: 'policy-detail-config-view',
            component: () => import('@/app/policies/views/PolicyDetailConfigView.vue'),
          },
        ],
      },
    ]
  }

  return {
    item,
  }
}
