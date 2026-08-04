import type { Can } from '@/app/application'
import { routes as connections, networking } from '@/app/connections/routes'
import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (can: Can, prefix = 'egresses') => {
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
          ...networking('zone-egress'),
          {
            path: 'config',
            name: 'zone-egress-config-view',
            component: () => import('@/app/zone-egresses/views/ZoneEgressConfigView.vue'),
          },
          {
            path: 'subscriptions',
            name: 'zone-egress-subscriptions-list-view',
            props: {
              i18nPrefix: 'zone-egresses',
              routePrefix: 'zone-egress',
            },
            component: () => import('@/app/subscriptions/views/SubscriptionsListView.vue'),
            children: [...subscriptions('zone-egress')],
          },
        ],
      },
    ]
  }

  const items = (): RouteRecordRaw[] => [
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

  return {
    items: (): RouteRecordRaw[] => {
      if(!can('use zones')) {
        return [
          {
            path: 'zones',
            name: 'zone-egress-index-view',
            redirect: { name: 'zone-egress-list-view '},
            children: [
              ...items(),
              ...item(),
            ],
          },
        ]
      }
      return items()
    },
    item,
  }
}
