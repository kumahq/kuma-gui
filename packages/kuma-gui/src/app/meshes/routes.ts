import { routes as meshIdentity } from '@/app/mesh-identities/routes'
import { routes as meshTrust } from '@/app/mesh-trusts/routes'
import type { RouteRecordRaw } from 'vue-router'

export type SplitRouteRecordRaw = {
  items: () => RouteRecordRaw[]
  item: () => RouteRecordRaw[]
}

export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'meshes',
      name: 'mesh-index-view',
      redirect: { name: 'mesh-list-view' },
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
                    ...meshIdentity().summary('mesh'),
                    ...meshTrust().summary('mesh'),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
