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
      component: () => import('@/app/meshes/views/MeshView.vue'),
      // if no mesh is specified redirect to /meshes
      redirect: () => ({ name: 'mesh-list-view' }),
      children: [
        {
          path: ':mesh',
          name: 'mesh-abstract-view',
          redirect: () => ({ name: 'mesh-detail-view' }),
          component: () => import('@/app/meshes/views/MeshItemView.vue'),
          children: [
            {
              path: '',
              name: 'mesh-detail-view',
              redirect: () => ({ name: 'mesh-overview-view' }),
              children: [
                {
                  path: 'overview',
                  meta: {
                    module: 'meshes',
                  },
                  name: 'mesh-overview-view',
                  component: () => import('@/app/meshes/views/MeshOverviewView.vue'),
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
