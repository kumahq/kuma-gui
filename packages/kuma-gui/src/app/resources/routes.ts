import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix: string) => {
  const summary = (): RouteRecordRaw[] => {
    return [
      {
        name: `${prefix}-resource-summary-view`,
        path: ':kri',
        component: () => import('@/app/resources/views/ResourceSummaryView.vue'),
      },
    ]
  }

  const item = (): RouteRecordRaw[] => {
    return [
      {
        name: `${prefix}-resource-detail-view`,
        path: 'resources/:kri/overview',
        props: {
          routePrefix: prefix,
        },
        component: () => import('@/app/resources/views/ResourceDetailView.vue'),
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
          component: () => import('@/app/resources/views/ResourceTypeListView.vue'),
          children: [
            {
              name: `${prefix}-resource-list-view`,
              path: ':shortName',
              props: {
                routePrefix: prefix,
              },
              component: () => import('@/app/resources/views/ResourceListView.vue'),
              children: [
                ...summary(),
              ],
            },
          ],
        },
      ]
    },
    item,
    summary,
  }
}
