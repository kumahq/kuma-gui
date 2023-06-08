import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/wizard',
      name: 'wizard',
      children: [
        {
          path: 'mesh',
          name: 'create-mesh',
          component: () => import('@/app/wizard/views/MeshWizard.vue'),
        },
        {
          path: 'kubernetes-dataplane',
          name: 'kubernetes-dataplane',
          component: () => import('@/app/wizard/views/DataplaneKubernetes.vue'),
        },
        {
          path: 'universal-dataplane',
          name: 'universal-dataplane',
          component: () => import('@/app/wizard/views/DataplaneUniversal.vue'),
        },
      ],
    },
  ]
}
