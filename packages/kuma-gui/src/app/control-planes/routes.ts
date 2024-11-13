import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '',
      name: 'home',
      component: () => import('@/app/control-planes/views/ControlPlaneDetailView.vue'),
    },
  ]
}
