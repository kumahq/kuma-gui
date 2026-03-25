import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const summary = (): RouteRecordRaw[] => {
    return [
      {
        name: 'resource-summary-view',
        path: ':kri',
        component: () => import('@/app/resources/views/ResourceSummaryView.vue'),
      },
    ]
  }

  const item = (): RouteRecordRaw[] => {
    return [
      {
        name: 'resource-detail-view',
        path: 'resources/:resourcePath/:kri/overview',
        component: () => import('@/app/resources/views/ResourceDetailView.vue'),
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          name: 'resource-types-list-view',
          path: 'resources',
          component: () => import('@/app/resources/views/ResourceTypesListView.vue'),
          children: [
            {
              name: 'resource-list-view',
              path: ':resourcePath',
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

export const meshIdentityRoutes = (prefix: string): RouteRecordRaw[] => {
  return [
    {
      path: 'meshidentity/:mid',
      name: `${prefix}-mesh-identity-summary-view`,
      component: () => import('@/app/resources/views/MeshIdentitySummaryView.vue'),
    },
  ]
}

export const meshTrustRoutes = (prefix: string): RouteRecordRaw[] => {
  return [
    {
      path: 'meshtrust/:mtrust',
      name: `${prefix}-mesh-trust-summary-view`,
      component: () => import('@/app/resources/views/MeshTrustSummaryView.vue'),
    },
  ]
}
