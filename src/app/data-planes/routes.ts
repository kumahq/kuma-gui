import type { RouteRecordRaw } from 'vue-router'
export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: 'data-planes/:dataPlane',
        name: 'data-plane-detail-tabs-view',
        component: () => import('@/app/data-planes/views/DataPlaneDetailTabsView.vue'),
        children: [
          {
            path: 'overview',
            name: 'data-plane-detail-view',
            component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
            children: [
              {
                path: 'inbound/:service',
                name: 'data-plane-inbound-summary-view',
                component: () => import('@/app/data-planes/views/DataPlaneInboundSummaryView.vue'),
                children: [
                  {
                    path: 'overview',
                    name: 'data-plane-inbound-summary-overview-view',
                    component: () => import('@/app/data-planes/views/DataPlaneInboundSummaryOverviewView.vue'),
                  },
                  {
                    path: 'stats',
                    name: 'data-plane-inbound-summary-stats-view',
                    component: () => import('@/app/data-planes/views/DataPlaneInboundSummaryStatsView.vue'),
                  },
                  {
                    path: 'clusters',
                    name: 'data-plane-inbound-summary-clusters-view',
                    component: () => import('@/app/data-planes/views/DataPlaneInboundSummaryClustersView.vue'),
                  },
                ],
              },
              {
                path: 'outbound/:service',
                name: 'data-plane-outbound-summary-view',
                component: () => import('@/app/data-planes/views/DataPlaneOutboundSummaryView.vue'),
                children: [
                  {
                    path: 'overview',
                    name: 'data-plane-outbound-summary-overview-view',
                    component: () => import('@/app/data-planes/views/DataPlaneOutboundSummaryOverviewView.vue'),
                  },
                  {
                    path: 'stats',
                    name: 'data-plane-outbound-summary-stats-view',
                    component: () => import('@/app/data-planes/views/DataPlaneOutboundSummaryStatsView.vue'),
                  },
                  {
                    path: 'clusters',
                    name: 'data-plane-outbound-summary-clusters-view',
                    component: () => import('@/app/data-planes/views/DataPlaneOutboundSummaryClustersView.vue'),
                  },

                ],
              },
            ],
          },
          {
            path: 'policies',
            name: 'data-plane-policies-view',
            component: () => import('@/app/data-planes/views/DataPlanePoliciesView.vue'),
          },
          {
            path: 'xds-config',
            name: 'data-plane-xds-config-view',
            component: () => import('@/app/data-planes/views/DataPlaneXdsConfigView.vue'),
          },
          {
            path: 'stats',
            name: 'data-plane-stats-view',
            component: () => import('@/app/data-planes/views/DataPlaneStatsView.vue'),
          },
          {
            path: 'clusters',
            name: 'data-plane-clusters-view',
            component: () => import('@/app/data-planes/views/DataPlaneClustersView.vue'),
          },
          {
            path: 'config',
            name: 'data-plane-config-view',
            component: () => import('@/app/data-planes/views/DataPlaneConfigView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'data-planes',
          name: 'data-plane-list-view',
          meta: {
            module: 'data-planes',
          },
          component: () => import('@/app/data-planes/views/DataPlaneListView.vue'),
          children: [
            {
              path: ':dataPlane',
              name: 'data-plane-summary-view',
              component: () => import('@/app/data-planes/views/DataPlaneSummaryView.vue'),
            },
          ],
        },
      ]
    },
    item,
  }
}
