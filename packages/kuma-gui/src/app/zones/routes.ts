import { routes as subscriptions } from '@/app/subscriptions/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (): RouteRecordRaw[] => {
  const prefix = 'zones'
  return [
    {
      path: `${prefix}`,
      name: 'zone-index-view',
      redirect: { name: 'zone-cp-list-view' },
      children: [
        {
          path: '',
          name: 'zone-cp-list-view',
          component: () => import('@/app/zones/views/ZoneListView.vue'),
        },
        {
          path: ':zone',
          name: 'zone-cp-detail-abstract-view',
          children: [
            {
              path: '',
              name: 'zone-cp-detail-tabs-view',
              component: () => import('@/app/zones/views/ZoneDetailTabsView.vue'),
              redirect: { name: 'zone-cp-detail-view' },
              children: [
                {
                  path: 'overview',
                  name: 'zone-cp-detail-view',
                  component: () => import('@/app/zones/views/ZoneDetailView.vue'),
                  children: subscriptions('zone-cp'),
                },
                {
                  path: 'config',
                  name: 'zone-cp-config-view',
                  component: () => import('@/app/zones/views/ZoneConfigView.vue'),
                },
                {
                  path: 'subscriptions',
                  name: 'zone-cp-subscriptions-list-view',
                  props: {
                    i18nPrefix: 'zone-cps',
                    routePrefix: 'zone-cp',
                  },
                  component: () => import('@/app/subscriptions/views/SubscriptionsListView.vue'),
                  children: [...subscriptions('zone-cp')],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
