import { zones as connections, networking } from '@/app/connections/routes'
import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix = 'ingresses') => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: `:proxyType(${prefix})/:proxy`,
        name: 'zone-ingress-detail-tabs-view',
        component: () => import('@/app/zone-ingresses/views/ZoneIngressDetailTabsView.vue'),
        redirect: { name: 'zone-ingress-detail-view' },
        children: [
          {
            path: 'overview',
            name: 'zone-ingress-detail-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressDetailView.vue'),
            children: [
              ...connections('zone-ingress'),
              ...subscriptions('zone-ingress'),
            ],
          },
          {
            path: 'services',
            name: 'zone-ingress-services-view',
            component: () => import('@/app/zone-ingresses/views/ZoneIngressServicesView.vue'),
          },
          ...networking('zone-ingress'),
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
              path: ':proxy',
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
