import { meshIdentityRoutes, meshTrustRoutes } from '../resources/routes'
import type { Can } from '@/app/application'
import type { RouteRecordRaw } from 'vue-router'

export type SplitRouteRecordRaw = {
  items: () => RouteRecordRaw[]
  item: () => RouteRecordRaw[]
}

export const routes = (
  can: Can,
  services: SplitRouteRecordRaw,
  gateways: SplitRouteRecordRaw,
  dataplanes: SplitRouteRecordRaw,
  policies: SplitRouteRecordRaw,
  workloads: SplitRouteRecordRaw,
  resources: SplitRouteRecordRaw,
): RouteRecordRaw[] => {
  return [
    {
      path: 'meshes',
      name: 'mesh-index-view',
      redirect: { name: 'mesh-list-view' },
      component: () => import('@/app/meshes/views/MeshRootView.vue'),
      children: [
        {
          path: '',
          name: 'mesh-list-view',
          component: () => import('@/app/meshes/views/MeshListView.vue'),
        },
        {
          path: ':mesh',
          name: 'mesh',
          redirect: { name: 'mesh-detail-view' },
          component: () => import('@/app/meshes/views/MeshView.vue'),
          children: [
            {
              path: '',
              name: 'mesh-detail-tabs-view',
              redirect: { name: 'mesh-detail-view' },
              component: () => import('@/app/meshes/views/MeshDetailTabsView.vue'),
              children: [
                {
                  path: 'overview',
                  name: 'mesh-detail-view',
                  component: () => import('@/app/meshes/views/MeshDetailView.vue'),
                  children: [
                    ...meshIdentityRoutes('mesh'),
                    ...meshTrustRoutes('mesh'),
                  ],
                },
                ...services.items(),
                ...workloads.items(),
                ...gateways.items(),
                ...dataplanes.items(),
                ...policies.items(),
                ...(can('use resources route') ? resources.items() : []),
              ],
            },
            ...services.item(),
            ...gateways.item(),
            ...dataplanes.item(),
            ...policies.item(),
            ...workloads.item(),
            ...(can('use resources route') ? resources.item() : []),
          ],
        },
      ],
    },
  ]
}
