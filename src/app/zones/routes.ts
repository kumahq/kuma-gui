import type { RouteRecordRaw } from 'vue-router'

export const actions = (): RouteRecordRaw[] => {
  return [{
    path: '/zones/-create',
    name: 'zone-create-view',
    meta: {
      isWizard: true,
    },
    component: () => import('@/app/zones/views/ZoneCreateView.vue'),
  }]
}

export const routes = (
  actions: RouteRecordRaw[],
): RouteRecordRaw[] => {
  return [
    ...actions,
    {
      path: '/zones',
      name: 'zone-index-view',
      redirect: { name: 'zone-cp-list-view' },
      children: [
        {
          path: 'zone-cps',
          name: 'zone-cps',
          children: [
            {
              path: '',
              name: 'zone-cp-tabs-view',
              meta: {
                module: 'zone-cps',
              },
              component: () => import('@/app/zones/views/ZoneTabsView.vue'),
              children: [
                {
                  path: '',
                  name: 'zone-cp-list-view',
                  component: () => import('@/app/zones/views/ZoneListView.vue'),
                },
              ],
            },
            {
              path: ':zone',
              name: 'zone-cp-detail-tabs-view',
              component: () => import('@/app/zones/views/ZoneDetailTabsView.vue'),
              children: [
                {
                  path: 'overview',
                  name: 'zone-cp-detail-view',
                  component: () => import('@/app/zones/views/ZoneDetailView.vue'),
                },
                {
                  path: 'config',
                  name: 'zone-cp-config-view',
                  component: () => import('@/app/zones/views/ZoneConfigView.vue'),
                },
              ],
            },
          ],
        },
        {
          path: 'zone-ingresses',
          name: 'zone-ingresses',
          children: [
            {
              path: '',
              name: 'zone-ingress-tabs-view',
              meta: {
                module: 'zone-ingresses',
              },
              component: () => import('@/app/zones/views/ZoneTabsView.vue'),
              children: [
                {
                  path: '',
                  name: 'zone-ingress-list-view',
                  component: () => import('@/app/zones/views/ZoneIngressListView.vue'),
                },
              ],
            },
            {
              path: ':zoneIngress',
              name: 'zone-ingress-detail-tabs-view',
              component: () => import('@/app/zones/views/ZoneIngressDetailTabsView.vue'),
              children: [
                {
                  path: 'overview',
                  name: 'zone-ingress-detail-view',
                  component: () => import('@/app/zones/views/ZoneIngressDetailView.vue'),
                },
                {
                  path: 'xds-config',
                  name: 'zone-ingress-xds-config-view',
                  component: () => import('@/app/zones/views/ZoneIngressXdsConfigView.vue'),
                },
                {
                  path: 'stats',
                  name: 'zone-ingress-stats-view',
                  component: () => import('@/app/zones/views/ZoneIngressStatsView.vue'),
                },
                {
                  path: 'clusters',
                  name: 'zone-ingress-clusters-view',
                  component: () => import('@/app/zones/views/ZoneIngressClustersView.vue'),
                },
                {
                  path: 'config',
                  name: 'zone-ingress-config-view',
                  component: () => import('@/app/zones/views/ZoneIngressConfigView.vue'),
                },
              ],
            },
          ],
        },
        {
          path: 'zone-egresses',
          name: 'zone-egresses',
          children: [
            {
              path: '',
              name: 'zone-egress-tabs-view',
              meta: {
                module: 'zone-egresses',
              },
              component: () => import('@/app/zones/views/ZoneTabsView.vue'),
              children: [
                {
                  path: '',
                  name: 'zone-egress-list-view',
                  component: () => import('@/app/zones/views/ZoneEgressListView.vue'),
                },
              ],
            },
            {
              path: ':zoneEgress',
              name: 'zone-egress-detail-tabs-view',
              component: () => import('@/app/zones/views/ZoneEgressDetailTabsView.vue'),
              children: [
                {
                  path: 'overview',
                  name: 'zone-egress-detail-view',
                  component: () => import('@/app/zones/views/ZoneEgressDetailView.vue'),
                },
                {
                  path: 'xds-config',
                  name: 'zone-egress-xds-config-view',
                  component: () => import('@/app/zones/views/ZoneEgressXdsConfigView.vue'),
                },
                {
                  path: 'stats',
                  name: 'zone-egress-stats-view',
                  component: () => import('@/app/zones/views/ZoneEgressStatsView.vue'),
                },
                {
                  path: 'clusters',
                  name: 'zone-egress-clusters-view',
                  component: () => import('@/app/zones/views/ZoneEgressClustersView.vue'),
                },
                {
                  path: 'config',
                  name: 'zone-egress-config-view',
                  component: () => import('@/app/zones/views/ZoneEgressConfigView.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
