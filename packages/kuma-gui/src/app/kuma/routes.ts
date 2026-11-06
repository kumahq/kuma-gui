import type { RouteRecordRaw } from 'vue-router'

export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: ':kri(kri_.*)',
      name: 'kuma-kri-view',
      component: () => import('@/app/kuma/views/KumaKriView.vue'),
    },
  ]
}

