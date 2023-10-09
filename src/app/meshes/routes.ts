import type { RouteRecordRaw } from 'vue-router'

export type SplitRouteRecordRaw = {
  items: () => RouteRecordRaw[]
  item: () => RouteRecordRaw[]
}

export const routes = (
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
      component: () => import('@/app/meshes/views/MeshIndexView.vue'),
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
              name: 'mesh-tabs-view',
              redirect: { name: 'mesh-detail-view' },
              component: () => import('@/app/meshes/views/MeshTabsView.vue'),
              children: [
                {
                  path: 'overview',
                  meta: {
                    module: 'meshes',
                  },
                  name: 'mesh-detail-view',
                  component: () => import('@/app/meshes/views/MeshDetailView.vue'),
                },
                {
                  path: 'config',
                  name: 'mesh-config-view',
                  component: () => import('@/app/meshes/views/MeshConfigView.vue'),
                },
                ...services.items(),
                ...gateways.items(),
                ...dataplanes.items(),
                ...policies.items(),
              ],
            },
            ...services.item(),
            ...gateways.item(),
            ...dataplanes.item(),
            ...policies.item(),
          ],
        },
      ],
    },
  ]
}
