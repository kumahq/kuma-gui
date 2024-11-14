import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'inbound/:connection',
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
        {
          path: 'xds-config',
          name: 'connection-inbound-summary-xds-config-view',
          component: () => import('@/app/connections/views/ConnectionInboundSummaryXdsConfigView.vue'),
        },
      ],
    },
    {
      path: 'outbound/:connection',
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
        {
          path: 'xds-config',
          name: 'connection-outbound-summary-xds-config-view',
          component: () => import('@/app/connections/views/ConnectionOutboundSummaryXdsConfigView.vue'),
        },
      ],
    },
  ]
}
