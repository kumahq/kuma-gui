import type { RouteRecordRaw } from 'vue-router'

export const meshIdentityRoutes = (prefix: string): RouteRecordRaw[] => {
  return [
    {
      path: 'meshidentity/:mid',
      name: `${prefix}-mesh-identity-summary-view`,
      component: () => import('@/app/resources/views/MeshIdentitySummaryView.vue'),
    },
  ]
}

export const meshTrustRoutes = (prefix: string): RouteRecordRaw[] => {
  return [
    {
      path: 'meshtrust/:mtrust',
      name: `${prefix}-mesh-trust-summary-view`,
      component: () => import('@/app/resources/views/MeshTrustSummaryView.vue'),
    },
  ]
}
