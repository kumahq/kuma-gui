import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const summary = (prefix: string): RouteRecordRaw[] => [
    {
      path: 'meshtrust/:mtrust',
      name: `${prefix}-mesh-trust-summary-view`,
      component: () => import('@/app/mesh-trusts/views/MeshTrustSummaryView.vue'),
    },
  ]
  
  return {
    summary,
  }
}
