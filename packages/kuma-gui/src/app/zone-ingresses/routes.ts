import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix = 'ingresses') => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}/:zoneIngress`,
        name: 'zone-ingress-detail-tabs-view',
        component: () => import('@/app/zone-ingresses/views/ZoneIngressDetailTabsView.vue'),
        redirect: { name: 'zone-ingress-detail-view' },
        children: [
          {
            path: 'overview',
            name: 'zone-ingress-detail-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressDetailView.vue'),
            children: [
              ...((prefix) => {
                return [
                  {
                    path: 'inbound/:connection',
                    name: `${prefix}-connection-inbound-summary-view`,
                    component: () => import('@/app/zone-ingresses/views/ConnectionInboundSummaryView.vue'),
                    children: [
                      {
                        path: 'stats',
                        name: `${prefix}-connection-inbound-summary-stats-view`,
                        component: () => import('@/app/zone-ingresses/views/ConnectionInboundSummaryStatsView.vue'),
                      },
                      {
                        path: 'clusters',
                        name: `${prefix}-connection-inbound-summary-clusters-view`,
                        component: () => import('@/app/zone-ingresses/views/ConnectionInboundSummaryClustersView.vue'),
                      },
                      {
                        path: 'xds-config',
                        name: `${prefix}-connection-inbound-summary-xds-config-view`,
                        component: () => import('@/app/zone-ingresses/views/ConnectionInboundSummaryXdsConfigView.vue'),
                      },
                    ],
                  },

                  {
                    path: 'outbound/:connection',
                    name: `${prefix}-connection-outbound-summary-view`,
                    component: () => import('@/app/zone-ingresses/views/ConnectionOutboundSummaryView.vue'),
                    children: [
                      {
                        path: 'stats',
                        name: `${prefix}-connection-outbound-summary-stats-view`,
                        component: () => import('@/app/zone-ingresses/views/ConnectionOutboundSummaryStatsView.vue'),
                      },
                      {
                        path: 'clusters',
                        name: `${prefix}-connection-outbound-summary-clusters-view`,
                        component: () => import('@/app/zone-ingresses/views/ConnectionOutboundSummaryClustersView.vue'),
                      },
                      {
                        path: 'xds-config',
                        name: `${prefix}-connection-outbound-summary-xds-config-view`,
                        component: () => import('@/app/zone-ingresses/views/ConnectionOutboundSummaryXdsConfigView.vue'),
                      },
                    ],
                  },

                ]
              })('zone-ingress'),
              ...subscriptions('zone-ingress'),
            ],
          },
          {
            path: 'services',
            name: 'zone-ingress-services-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressServicesView.vue'),
          },
          {
            path: 'xds-config',
            name: 'zone-ingress-xds-config-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressXdsConfigView.vue'),
          },
          {
            path: 'stats',
            name: 'zone-ingress-stats-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressStatsView.vue'),
          },
          {
            path: 'clusters',
            name: 'zone-ingress-clusters-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressClustersView.vue'),
          },
          {
            path: 'config',
            name: 'zone-ingress-config-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressConfigView.vue'),
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
          name: 'zone-ingress-list-view',
          component: () => import('@/app/zone-ingresses/views/ZoneIngressListView.vue'),
          children: [
            {
              path: ':zoneIngress',
              name: 'zone-ingress-summary-view',
              component: () => import('@/app/zone-ingresses/views/ZoneIngressSummaryView.vue'),
            },
          ],
        },
      ]
    },
    item,
  }
}
