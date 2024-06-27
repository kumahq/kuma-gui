import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/zones/-create',
      name: 'zone-create-view',
      component: () => import('@/app/zones-crud/views/ZoneCreateView.vue'),
    },
  ]
}
