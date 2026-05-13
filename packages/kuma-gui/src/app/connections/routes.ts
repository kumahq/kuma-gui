import type { RouteRecordRaw } from 'vue-router'

export const networking = (prefix: string) => {
  return [
    {
      path: 'xds-config',
      name: `${prefix}-xds-config-view`,
      component: () => import('@/app/connections/views/ConnectionsXdsConfigView.vue'),
    },
    {
      path: 'stats',
      name: `${prefix}-stats-view`,
      component: () => import('@/app/connections/views/ConnectionsStatsView.vue'),
    },
    {
      path: 'clusters',
      name: `${prefix}-clusters-view`,
      component: () => import('@/app/connections/views/ConnectionsClustersView.vue'),
    },

  ]
}
export const routes = (prefix: string): RouteRecordRaw[] => {
  return [
    {
      path: 'inbound/:connection',
      name: `${prefix}-connection-inbound-summary-view`,
      component: () => import('@/app/connections/views/ConnectionInboundSummaryView.vue'),
      children: [
        {
          path: 'stats',
          name: `${prefix}-connection-inbound-summary-stats-view`,
          component: () => import('@/app/connections/views/ConnectionInboundSummaryStatsView.vue'),
        },
        {
          path: 'clusters',
          name: `${prefix}-connection-inbound-summary-clusters-view`,
          component: () => import('@/app/connections/views/ConnectionInboundSummaryClustersView.vue'),
        },
        {
          path: 'xds-config',
          name: `${prefix}-connection-inbound-summary-xds-config-view`,
          component: () => import('@/app/connections/views/ConnectionInboundSummaryXdsConfigView.vue'),
        },
      ],
    },
    {
      path: 'outbound/:connection',
      name: `${prefix}-connection-outbound-summary-view`,
      component: () => import('@/app/connections/views/ConnectionOutboundSummaryView.vue'),
      children: [
        {
          path: 'stats',
          name: `${prefix}-connection-outbound-summary-stats-view`,
          component: () => import('@/app/connections/views/ConnectionOutboundSummaryStatsView.vue'),
        },
        {
          path: 'clusters',
          name: `${prefix}-connection-outbound-summary-clusters-view`,
          component: () => import('@/app/connections/views/ConnectionOutboundSummaryClustersView.vue'),
        },
        {
          path: 'xds-config',
          name: `${prefix}-connection-outbound-summary-xds-config-view`,
          component: () => import('@/app/connections/views/ConnectionOutboundSummaryXdsConfigView.vue'),
        },
      ],
    },
    {
      path: 'listener/:connection',
      name: `${prefix}-connection-listener-summary-view`,
      // component: () => import('@/app/connections/views/ConnectionListenerSummaryView.vue'),
      children: [
        {
          path: 'stats',
          name: `${prefix}-connection-listener-summary-stats-view`,
          component: () => import('@/app/connections/views/ConnectionListenerSummaryStatsView.vue'),
        },
        {
          path: 'clusters',
          name: `${prefix}-connection-listener-summary-clusters-view`,
          component: () => import('@/app/connections/views/ConnectionListenerSummaryClustersView.vue'),
        },
        {
          path: 'xds-config',
          name: `${prefix}-connection-listener-summary-xds-config-view`,
          component: () => import('@/app/connections/views/ConnectionListenerSummaryXdsConfigView.vue'),
        },
      ],
    },
  ]
}
