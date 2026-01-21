import type { RouteRecordRaw } from 'vue-router'

export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'meshtrust/:mtrust',
      name: 'mesh-trust-summary-view',
      component: () => import('@/app/mesh-trusts/views/MeshTrustSummaryView.vue'),
    },
  ]
}
