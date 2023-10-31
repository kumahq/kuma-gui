import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix = 'egresses') => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}/:zoneEgress`,
        name: 'zone-egress-detail-tabs-view',
        component: () => import('@/app/zone-egresses/views/item/IndexView.vue'),
        redirect: { name: 'zone-egress-detail-view' },
        children: [
          {
            path: 'overview',
            name: 'zone-egress-detail-view',
            component: () => import('@/app/zone-egresses/views/item/DetailView.vue'),
          },
          {
            path: 'xds-config',
            name: 'zone-egress-xds-config-view',
            component: () => import('@/app/zone-egresses/views/item/XdsConfigView.vue'),
          },
          {
            path: 'stats',
            name: 'zone-egress-stats-view',
            component: () => import('@/app/zone-egresses/views/item/StatsView.vue'),
          },
          {
            path: 'clusters',
            name: 'zone-egress-clusters-view',
            component: () => import('@/app/zone-egresses/views/item/ClustersView.vue'),
          },
          {
            path: 'config',
            name: 'zone-egress-config-view',
            component: () => import('@/app/zone-egresses/views/item/ConfigView.vue'),
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
          meta: {
            module: 'zone-egresses',
          },
          component: () => import('@/app/zone-egresses/views/IndexView.vue'),
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
