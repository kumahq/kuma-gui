import { getLastNumberParameter } from '@/router/getLastParameter'
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
      component: () => import('@/app/zones/views/ZoneIndexView.vue'),
      redirect: () => ({ name: 'zone-cp-list-view' }),
      children: [
        {
          path: 'zone-cps',
          name: 'zone-cp-abstract-view',
          children: [
            {
              path: '',
              name: 'zone-cp-list-view',
              props: (route) => ({
                selectedZoneName: route.query.zone,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/zones/views/ZoneListView.vue'),
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
          name: 'zone-ingress-abstract-view',
          children: [
            {
              path: '',
              name: 'zone-ingress-list-view',
              props: (route) => ({
                selectedZoneIngressName: route.query.zoneIngress,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/zones/views/ZoneIngressListView.vue'),
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
          name: 'zone-egress-abstract-view',
          children: [
            {
              path: '',
              name: 'zone-egress-list-view',
              props: (route) => ({
                selectedZoneEgressName: route.query.zoneEgress,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/zones/views/ZoneEgressListView.vue'),
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
