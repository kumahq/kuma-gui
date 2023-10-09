import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  const prefix = '/'
  return [
    {
      path: `${prefix}`,
      name: 'home',
      component: () => import('@/app/main-overview/views/MainOverviewView.vue'),
    },
  ]
}
