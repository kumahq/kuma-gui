import type { RouteRecordRaw } from 'vue-router'

export const meshIdentityRoutes = (prefix?: string): RouteRecordRaw[] => {
  return [
    {
      path: 'meshidentity/:name',
      name: `${prefix ? `${prefix}-` : ''}mesh-identity-summary-view`,
      component: () => import('@/app/resources/views/MeshIdentitySummaryView.vue'),
    },
  ]
}

export const meshTrustRoutes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'meshtrust/:name',
      name: 'mesh-trust-summary-view',
      component: () => import('@/app/resources/views/MeshTrustSummaryView.vue'),
    },
  ]
}
