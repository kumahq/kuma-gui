import type { Can } from '@/app/application/services/can'
import { routes as egresses } from '@/app/zone-egresses/routes'
import { routes as ingresses } from '@/app/zone-ingresses/routes'
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
  can: Can,
): RouteRecordRaw[] => {
  const prefix = '/zones'
  return [
    ...actions,
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
              meta: {
                module: 'zone-cps',
              },
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
                    },
                    {
                      path: 'config',
                      name: 'zone-cp-config-view',
                      component: () => import('@/app/zones/views/ZoneConfigView.vue'),
                    },
                    ...ingresses().items(),
                    ...egresses().items(),
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
          redirect: { name: 'zone-egress-list-view' },
          children: [
            ...egresses().items(),
            ...egresses().item(),
          ],
        },
      ]),
  ]
}
