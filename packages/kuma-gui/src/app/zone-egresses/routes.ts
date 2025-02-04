import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix = 'egresses') => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}/:zoneEgress`,
        name: 'zone-egress-detail-tabs-view',
        component: () => import('@/app/zone-egresses/views/ZoneEgressDetailTabsView.vue'),
        redirect: { name: 'zone-egress-detail-view' },
        children: [
          {
            path: 'overview',
            name: 'zone-egress-detail-view',
            component: () => import('@/app/zone-egresses/views/ZoneEgressDetailView.vue'),
            children: [
              ...((prefix) => {
                return [
                  {
                    path: 'inbound/:connection',
                    name: `${prefix}-connection-inbound-summary-view`,
                    component: () => import('@/app/zone-egresses/views/ConnectionInboundSummaryView.vue'),
                    children: [
                      {
                        path: 'stats',
                        name: `${prefix}-connection-inbound-summary-stats-view`,
                        component: () => import('@/app/zone-egresses/views/ConnectionInboundSummaryStatsView.vue'),
                      },
                      {
                        path: 'clusters',
                        name: `${prefix}-connection-inbound-summary-clusters-view`,
                        component: () => import('@/app/zone-egresses/views/ConnectionInboundSummaryClustersView.vue'),
                      },
                      {
                        path: 'xds-config',
                        name: `${prefix}-connection-inbound-summary-xds-config-view`,
                        component: () => import('@/app/zone-egresses/views/ConnectionInboundSummaryXdsConfigView.vue'),
                      },
                    ],
                  },

                  {
                    path: 'outbound/:connection',
                    name: `${prefix}-connection-outbound-summary-view`,
                    component: () => import('@/app/zone-egresses/views/ConnectionOutboundSummaryView.vue'),
                    children: [
                      {
                        path: 'stats',
                        name: `${prefix}-connection-outbound-summary-stats-view`,
                        component: () => import('@/app/zone-egresses/views/ConnectionOutboundSummaryStatsView.vue'),
                      },
                      {
                        path: 'clusters',
                        name: `${prefix}-connection-outbound-summary-clusters-view`,
                        component: () => import('@/app/zone-egresses/views/ConnectionOutboundSummaryClustersView.vue'),
                      },
                      {
                        path: 'xds-config',
                        name: `${prefix}-connection-outbound-summary-xds-config-view`,
                        component: () => import('@/app/zone-egresses/views/ConnectionOutboundSummaryXdsConfigView.vue'),
                      },
                    ],
                  },

                ]
              })('zone-egress'),
              ...subscriptions('zone-egress'),
            ],
          },
          {
            path: 'xds-config',
            name: 'zone-egress-xds-config-view',
            component: () => import('@/app/zone-egresses/views/ZoneEgressXdsConfigView.vue'),
          },
          {
            path: 'stats',
            name: 'zone-egress-stats-view',
            component: () => import('@/app/zone-egresses/views/ZoneEgressStatsView.vue'),
          },
          {
            path: 'clusters',
            name: 'zone-egress-clusters-view',
            component: () => import('@/app/zone-egresses/views/ZoneEgressClustersView.vue'),
          },
          {
            path: 'config',
            name: 'zone-egress-config-view',
            component: () => import('@/app/zone-egresses/views/ZoneEgressConfigView.vue'),
          },
        ],
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: `${prefix}`,
          name: 'zone-egress-list-view',
          component: () => import('@/app/zone-egresses/views/ZoneEgressListView.vue'),
          children: [
            {
              path: ':zoneEgress',
              name: 'zone-egress-summary-view',
              component: () => import('@/app/zone-egresses/views/ZoneEgressSummaryView.vue'),
            },
          ],
        },
      ]
    },
    item,
  }
}
