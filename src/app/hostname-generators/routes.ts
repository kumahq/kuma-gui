import type { RouteRecordRaw } from 'vue-router'

export type SplitRouteRecordRaw = {
  items: () => RouteRecordRaw[]
  item: () => RouteRecordRaw[]
}

export const routes = (
): RouteRecordRaw[] => {
  return [
    {
      path: '/hostname-generators',
      name: 'hostname-generator-root-view',
      redirect: { name: 'hostname-generator-list-view' },
      component: () => import('@/app/hostname-generators/views/HostnameGeneratorRootView.vue'),
      children: [
        {
          path: '',
          name: 'hostname-generator-list-view',
          component: () => import('@/app/hostname-generators/views/HostnameGeneratorListView.vue'),
          children: [
            {
              path: ':name',
              name: 'hostname-generator-summary-view',
              component: () => import('@/app/hostname-generators/views/HostnameGeneratorSummaryView.vue'),
            },
          ],
        },
        {
          path: ':name/overview',
          name: 'hostname-generator-detail-view',
          component: () => import('@/app/hostname-generators/views/HostnameGeneratorDetailView.vue'),
        },
      ],
    },
  ]
}
