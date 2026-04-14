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
      /**
       * The following approach doesn't work because:
       * - using `props` sets props and not params
       * - we need to alter the params to fit the expected params of the different detail views (i.e. kri vs proxy)
       * - using a component `*DetailView.vue` won't work if the respective detail view depends on a parent that sets a data prop of the fetched resource
       * - 
       */
      {
        name: 'policy-resource-detail-view',
        path: 'resources/:scope(policies)/:policyPath/:kri/overview',
        component: () => import('@/app/policies/views/PolicyDetailView.vue'),
      },
      {
        name: 'dataplane-resource-detail-view',
        path: 'resources/:scope(mesh)/:resourcePath(dataplanes)/:kri/overview',
        component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
      },
      {
        name: 'mesh-resource-detail-view',
        path: 'resources/:scope(mesh)/:resourcePath/:kri/overview',
        component: () => import('@/app/data-planes/views/ResourceDetailView.vue'),
      },
      {
        name: 'global-resource-detail-view',
        path: 'resources/:scope(global)/:resourcePath/:kri/overview',
        redirect: (to) => {
          console.log('redirecting to global resource detail view', to)
          switch(true) {
            case to.params.resourcePath === 'meshes':
              return {
                name: 'mesh-detail-view',
                params: { mesh: to.params.kri },
              }
            case to.params.resourcePath === 'zoneingresses':
              return {
                name: 'zone-ingress-detail-view',
                params: { proxy: to.params.kri },
              }
            case to.params.resourcePath === 'zoneegresses':
              return {
                name: 'zone-egress-detail-view',
                params: { proxy: to.params.kri },
              }
            case to.params.resourcePath === 'zones':
              console.log('redirecting to zone detail view', to)
              return {
                name: 'zone-cp-detail-view',
                params: { zone: to.params.kri },
              }
            case to.params.resourcePath === 'hostnamegenerators':
              return {
                name: 'hostname-generator-detail-view',
                params: { name: to.params.kri },
              }
            default: {
              return {
                name: 'resource-detail-view',
                params: to.params,
              }
            }
          }
        }
      },
      {
        name: 'resource-detail-view',
        path: 'resources/:scope/:resourcePath/:kri/overview',
        redirect: (to) => {
          switch(true) {
            case to.params.scope === 'mesh':
              return {
                name: 'mesh-resource-detail-view',
                params: to.params,
              }
            case to.params.scope === 'policies':
              console.log('redirecting to policy resource detail view', to)
              return {
                name: 'policy-resource-detail-view',
                params: {
                  ...to.params,
                  policy: to.params.kri,
                  policyPath: to.params.resourcePath,
                },
              }
            case to.params.scope === 'global':
              return {
                name: 'global-resource-detail-view',
                params: to.params,
              }
            default:
              return {
                name: 'resource-generic-detail-view',
                params: to.params,
              }
          }
        }
        // component: () => import('@/app/resources/views/ResourceDetailView.vue'),
      },
      {
        name: 'resource-generic-detail-view',
        path: 'resources/:scope/:resourcePath/:kri/overview',
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
              path: ':scope/:resourcePath',
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
