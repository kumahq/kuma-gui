import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/configuration',
      name: 'configuration',
      component: () => import('@/app/configuration/views/ConfigurationDetailView.vue'),
    },

  ]
}
