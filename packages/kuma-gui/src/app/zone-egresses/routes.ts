import { zones as connections } from '@/app/connections/routes'
import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix = 'egresses') => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: `:proxyType(${prefix})/:proxy`,
        name: 'zone-egress-detail-tabs-view',
        component: () => import('@/app/zone-egresses/views/ZoneEgressDetailTabsView.vue'),
        redirect: { name: 'zone-egress-detail-view' },
        children: [
          {
            path: 'overview',
            name: 'zone-egress-detail-view',
            component: () => import('@/app/zone-egresses/views/ZoneEgressDetailView.vue'),
            children: [
              ...connections('zone-egress'),
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
              path: ':proxy',
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
