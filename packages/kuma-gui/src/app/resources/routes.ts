import type { RouteRecordRaw } from 'vue-router'

export const controlPlaneRoutes = (): RouteRecordRaw[] => {
  return [
    {
      name: 'control-plane-resource-type-list-view',
      path: 'resources',
      component: () => import('./views/ControlPlaneResourceTypeListView.vue'),
    },
  ]
}
export const routes = (prefix: string) => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        name: `${prefix}-resource-detail-view`,
        path: 'resources/:kri/overview',
        props: {
          routePrefix: prefix,
        },
        component: () => import('./views/ResourceDetailView.vue'),
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          name: `${prefix}-resource-type-list-view`,
          path: 'resources',
          props: {
            routePrefix: prefix,
          },
          component: () => import('./views/ResourceTypeListView.vue'),
          children: [
            {
              name: `${prefix}-resource-list-view`,
              path: ':shortName',
              props: {
                routePrefix: prefix,
              },
              component: () => import('./views/ResourceListView.vue'),
              children: [
                {
                  name: `${prefix}-resource-summary-view`,
                  path: ':kri',
                  component: () => import('./views/ResourceSummaryView.vue'),
                },
              ],
            },
          ],
        },
      ]
    },
    item,
  }
}
