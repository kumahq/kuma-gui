import { routes as resourcesRoutes } from '@/app/resources/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '',
      name: 'control-plane-root-view',
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

export const controlPlaneResourcesRoutes = () => {
  const cpResourcesRoutes = resourcesRoutes('control-plane')
  return [
    {
      name: 'control-plane-resource-type-list-view',
      path: 'resources',
      component: () => import('@/app/control-planes/views/ControlPlaneResourceTypeListView.vue'),
      children: cpResourcesRoutes.items()[0].children,
    },
    ...cpResourcesRoutes.item(),
  ]
}
