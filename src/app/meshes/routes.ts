import type { RouteRecordRaw } from 'vue-router'

export type SplitRouteRecordRaw = {
  items: () => RouteRecordRaw[]
  item: () => RouteRecordRaw[]
}

export const routes = (
  services: SplitRouteRecordRaw,
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
          children: [
            {
              path: ':mesh',
              name: 'mesh-summary-view',
              component: () => import('@/app/meshes/views/MeshSummaryView.vue'),
            },
          ],
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
                {
                  path: 'config',
                  name: 'mesh-config-view',
                  component: () => import('@/app/meshes/views/MeshConfigView.vue'),
                },
                ...services.items(),
                ...dataplanes.items(),
                ...policies.items(),
              ],
            },
            ...services.item(),
            ...dataplanes.item(),
            ...policies.item(),
          ],
        },
      ],
    },
  ]
}
