import { PAGE_SIZE_DEFAULT } from '@/constants'
import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'

export type SplitRouteRecordRaw = {
  items: (prefix: string) => RouteRecordRaw[]
  item: (prefix: string) => RouteRecordRaw[]
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
      name: 'mesh-list-view',
      props: (route) => ({
        page: getLastNumberParameter(route.query.page, 1),
        size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
      }),
      component: () => import('@/app/meshes/views/MeshListView.vue'),
    },
    {
      path: '/mesh',
      name: 'mesh-index-view',
      // if no mesh is specified redirect to /meshes
      redirect: { name: 'mesh-list-view' },
      component: () => import('@/app/meshes/views/MeshIndexView.vue'),
      children: [
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
                ...services.items('services'),
                ...gateways.items('gateways'),
                ...dataplanes.items('data-planes'),
                ...policies.items('policies'),
              ],
            },
            ...services.item('service'),
            ...gateways.item('gateway'),
            ...dataplanes.item('data-plane'),
            ...policies.item('policy'),
          ],
        },
      ],
    },
  ]
}
