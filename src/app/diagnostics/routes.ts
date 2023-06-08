import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/diagnostics',
      name: 'diagnostics',
      component: () => import('@/app/diagnostics/views/DiagnosticsView.vue'),
    },

  ]
}
