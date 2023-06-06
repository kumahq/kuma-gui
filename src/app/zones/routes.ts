import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'

export const actions = (): RouteRecordRaw[] => {
  return [{
    path: '/zone-cps/-create',
    name: 'zone-create-view',
    meta: {
      title: 'Create & connect Zone',
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
      meta: {
        title: 'Zones',
        isBreadcrumb: true,
      },
      component: () => import('@/app/zones/views/ZoneIndexView.vue'),
      redirect: () => ({ name: 'zone-cp-list-view' }),
      children: [
        {
          path: 'zone-cps',
          name: 'zone-cp-abstract-view',
          meta: {
            title: 'Zone CPs',
            isBreadcrumb: true,
          },
          children: [
            {
              path: '',
              name: 'zone-cp-list-view',
              meta: {
                title: 'Zone CPs',
              },
              props: (route) => ({
                selectedZoneName: route.query.zone,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/zones/views/ZoneListView.vue'),
            },
            {
              path: ':zone',
              name: 'zone-cp-detail-view',
              meta: {
                title: 'Zone',
                isBreadcrumb: true,
                breadcrumbTitleParam: 'zone',
              },
              component: () => import('@/app/zones/views/ZoneDetailView.vue'),
            },
          ],
        },
        {
          path: 'zone-ingresses',
          name: 'zone-ingress-abstract-view',
          meta: {
            title: 'Zone Ingresses',
            isBreadcrumb: true,
          },
          children: [
            {
              path: '',
              name: 'zone-ingress-list-view',
              meta: {
                title: 'Zone Ingresses',
              },
              props: (route) => ({
                selectedZoneIngressName: route.query.zoneIngress,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/zones/views/ZoneIngressListView.vue'),
            },
            {
              path: ':zoneIngress',
              name: 'zone-ingress-detail-view',
              meta: {
                title: 'Zone Ingress',
                isBreadcrumb: true,
                breadcrumbTitleParam: 'zoneIngress',
              },
              component: () => import('@/app/zones/views/ZoneIngressDetailView.vue'),
            },
          ],
        },
        {
          path: 'zone-egresses',
          name: 'zone-egress-abstract-view',
          meta: {
            title: 'Zone Egresses',
            isBreadcrumb: true,
          },
          children: [
            {
              path: '',
              name: 'zone-egress-list-view',
              meta: {
                title: 'Zone Egresses',
              },
              props: (route) => ({
                selectedZoneEgressName: route.query.zoneEgress,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/zones/views/ZoneEgressListView.vue'),
            },
            {
              path: ':zoneEgress',
              meta: {
                title: 'Zone Egress',
                isBreadcrumb: true,
                breadcrumbTitleParam: 'zoneEgress',
              },
              name: 'zone-egress-detail-view',
              component: () => import('@/app/zones/views/ZoneEgressDetailView.vue'),
            },
          ],
        },
      ],
    },
  ]
}
