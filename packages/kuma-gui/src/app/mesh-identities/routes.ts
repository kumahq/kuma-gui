import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const summary = (prefix: string): RouteRecordRaw[] => [
    {
      path: 'meshidentity/:mid',
      name: `${prefix}-mesh-identity-summary-view`,
      component: () => import('@/app/mesh-identities/views/MeshIdentitySummaryView.vue'),
    },
  ]

  return {
    summary,
  }
}
