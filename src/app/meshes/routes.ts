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
      meta: {
        title: 'Meshes',
        isBreadcrumb: true,
      },
      props: (route) => ({
        page: getLastNumberParameter(route.query.page),
        selectedMeshName: route.query.mesh,
      }),
      component: () => import('@/app/meshes/views/MeshListView.vue'),
    },
    {
      path: '/mesh',
      name: 'mesh-index-view',
      meta: {
        title: 'Meshes',
        isBreadcrumb: true,
      },
      redirect: () => ({ name: 'mesh-list-view' }),
      children: [
        {
          path: ':mesh',
          name: 'mesh-detail-view',
          meta: {
            title: 'Mesh',
            isBreadcrumb: true,
            breadcrumbTitleParam: 'mesh',
          },
          redirect: () => ({ name: 'mesh-overview-view' }),
          children: [
            {
              name: 'mesh-abstract-view',
              path: '',
              redirect: () => ({ name: 'mesh-overview-view' }),
              component: () => import('@/app/meshes/views/MeshView.vue'),
              children: [
                {
                  path: 'overview',
                  name: 'mesh-overview-view',
                  meta: {
                    title: 'Mesh overview',
                  },
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
