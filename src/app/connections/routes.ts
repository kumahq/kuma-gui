import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'inbound/:service',
      name: 'connection-inbound-summary-view',
      component: () => import('@/app/connections/views/ConnectionInboundSummaryView.vue'),
      children: [
        {
          path: 'overview',
          name: 'connection-inbound-summary-overview-view',
          component: () => import('@/app/connections/views/ConnectionInboundSummaryOverviewView.vue'),
        },
        {
          path: 'stats',
          name: 'connection-inbound-summary-stats-view',
          component: () => import('@/app/connections/views/ConnectionInboundSummaryStatsView.vue'),
        },
        {
          path: 'clusters',
          name: 'connection-inbound-summary-clusters-view',
          component: () => import('@/app/connections/views/ConnectionInboundSummaryClustersView.vue'),
        },
      ],
    },
    {
      path: 'outbound/:service',
      name: 'connection-outbound-summary-view',
      component: () => import('@/app/connections/views/ConnectionOutboundSummaryView.vue'),
      children: [
        {
          path: 'overview',
          name: 'connection-outbound-summary-overview-view',
          component: () => import('@/app/connections/views/ConnectionOutboundSummaryOverviewView.vue'),
        },
        {
          path: 'stats',
          name: 'connection-outbound-summary-stats-view',
          component: () => import('@/app/connections/views/ConnectionOutboundSummaryStatsView.vue'),
        },
        {
          path: 'clusters',
          name: 'connection-outbound-summary-clusters-view',
          component: () => import('@/app/connections/views/ConnectionOutboundSummaryClustersView.vue'),
        },

      ],
    },
  ]
}
