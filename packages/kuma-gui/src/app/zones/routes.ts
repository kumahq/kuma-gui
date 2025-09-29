import type { Can } from '@/app/application'
import { routes as subscriptions } from '@/app/subscriptions/routes'
import { routes as egresses } from '@/app/zone-egresses/routes'
import { routes as ingresses } from '@/app/zone-ingresses/routes'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (
  can: Can,
): RouteRecordRaw[] => {
  const prefix = 'zones'
  return [
    ...(can('use zones')
      ? [
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
                    ...ingresses().items(),
                    ...egresses().items(),
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
                ...ingresses().item(),
                ...egresses().item(),
              ],
            },
          ],
        },

      ]
      : [
        {
          path: `${prefix}`,
          name: 'zone-egress-index-view',
          redirect: { name: 'zone-egress-list-view' },
          children: [
            ...egresses().items(),
            ...egresses().item(),
          ],
        },
      ]),
  ]
}
