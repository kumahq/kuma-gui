import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix?: string): RouteRecordRaw[] => {
  return [
    {
      path: 'meshidentity/:mid',
      name: `${prefix ? `${prefix}-` : ''}mesh-identity-summary-view`,
      component: () => import('@/app/mesh-identities/views/MeshIdentitySummaryView.vue'),
    },
  ]
}
