import type { Can } from '@/app/application/services/can'
import type { RouteRecordRaw } from 'vue-router'

export type SplitRouteRecordRaw = {
  items: (prefix?: string) => RouteRecordRaw[]
  item: (prefix?: string) => RouteRecordRaw[]
}

export const routes = (
  can: Can,
  services: SplitRouteRecordRaw,
  gateways: SplitRouteRecordRaw,
  dataplanes: SplitRouteRecordRaw,
  policies: SplitRouteRecordRaw,
): RouteRecordRaw[] => {
  return [
    {
      path: '/meshes',
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
          children: [
            {
              path: '',
              name: 'mesh-detail-tabs-view',
              redirect: { name: 'mesh-detail-view' },
              component: () => import('@/app/meshes/views/MeshDetailTabsView.vue'),
              children: [
                {
                  path: 'overview',
                  meta: {
                    module: 'meshes',
                  },
                  name: 'mesh-detail-view',
                  component: () => import('@/app/meshes/views/MeshDetailView.vue'),
                },
                ...services.items(can('use gateways ui') ? 'internal' : ''),
                ...(can('use gateways ui') ? gateways.items() : []),
                ...dataplanes.items(),
                ...policies.items(),
              ],
            },
            ...services.item(can('use gateways ui') ? 'internal/' : ''),
            ...(can('use gateways ui') ? gateways.item() : []),
            ...dataplanes.item(),
            ...policies.item(),
          ],
        },
      ],
    },
  ]
}
