import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/diagnostics',
      name: 'diagnostics',
      meta: {
        title: 'Diagnostics',
        isBreadcrumb: true,
      },
      component: () => import('@/app/diagnostics/views/DiagnosticsView.vue'),
    },

  ]
}
