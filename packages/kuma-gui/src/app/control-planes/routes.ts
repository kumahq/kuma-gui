import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '',
      name: 'home',
      component: () => import('@/app/control-planes/views/ControlPlaneRootView.vue'),
      redirect: { name: 'control-plane-detail-view' },
      children: [
        {
          path: '',
          name: 'control-plane-detail-view',
          component: () => import('@/app/control-planes/views/ControlPlaneDetailView.vue'),
        },
      ],
    },
  ]
}
