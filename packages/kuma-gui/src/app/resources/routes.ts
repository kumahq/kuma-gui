import type { RouteRecordRaw } from 'vue-router'

export const meshIdentityRoutes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'meshidentity/:name',
      name: 'mesh-identity-summary-view',
      component: () => import('@/app/resources/views/MeshIdentitySummaryView.vue'),
    },
  ]
}
