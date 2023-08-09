import { PAGE_SIZE_DEFAULT } from '@/constants'
import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'

export const actions = (): RouteRecordRaw[] => {
  return [{
    path: '/zones/create',
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
                  props: (route) => ({
                    page: getLastNumberParameter(route.query.page, 1),
                    size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
                  }),
                  component: () => import('@/app/zones/views/ZoneListView.vue'),
                },
              ],
            },
            {
              path: ':zone',
              name: 'zone-cp-detail-view',
              component: () => import('@/app/zones/views/ZoneDetailView.vue'),
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
                  props: (route) => ({
                    page: getLastNumberParameter(route.query.page, 1),
                    size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
                  }),
                  component: () => import('@/app/zones/views/ZoneIngressListView.vue'),
                },
              ],
            },
            {
              path: ':zoneIngress',
              name: 'zone-ingress-detail-view',
              component: () => import('@/app/zones/views/ZoneIngressDetailView.vue'),
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
                  props: (route) => ({
                    page: getLastNumberParameter(route.query.page, 1),
                    size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
                  }),
                  component: () => import('@/app/zones/views/ZoneEgressListView.vue'),
                },
              ],
            },
            {
              path: ':zoneEgress',
              name: 'zone-egress-detail-view',
              component: () => import('@/app/zones/views/ZoneEgressDetailView.vue'),
            },
          ],
        },
      ],
    },
  ]
}
