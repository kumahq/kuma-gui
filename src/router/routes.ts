import { RouteRecordRaw } from 'vue-router'
export default (
  routes: RouteRecordRaw[],
): RouteRecordRaw[] => {
  return [
    {
      path: '/404',
      name: 'not-found',
      alias: '/:pathMatch(.*)*',
      meta: {
        title: 'Item not found',
      },
      component: () => import('@/app/AppNotFoundView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/app/main-overview/views/MainOverviewView.vue'),
    },
    ...routes,
  ]
}
