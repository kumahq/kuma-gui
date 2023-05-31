import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'
export const actions = (): RouteRecordRaw[] => {
  return [{
    path: '-create',
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
    {
      path: '/zones',
      name: 'zone-abstract-view',
      children: [
        {
          path: '',
          meta: {
            title: 'Zones',
            isBreadcrumb: true,
          },
          redirect: () => ({ name: 'zone-list-view' }),
          name: 'zone-view',
          children: [
            {
              path: '',
              name: 'zone-list-view',
              meta: {
                title: 'Zone CPs',
              },
              props: (route) => ({
                selectedZoneName: route.query.zone,
                offset: getLastNumberParameter(route.query.offset),
              }),
              component: () => import('@/app/zones/views/ZoneListView.vue'),
            },
            ...actions,
            {
              path: ':zone',
              name: 'zone-detail-view',
              meta: {
                getTitle: (route) => route.params.zone as string,
                isBreadcrumb: true,
                breadcrumbTitleParam: 'zone',
              },
              component: () => import('@/app/zones/views/ZoneDetailView.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/zone-ingresses',
      name: 'zone-ingress-abstract-view',
      children: [
        {
          path: '',
          meta: {
            title: 'Zone Ingresses',
            isBreadcrumb: true,
          },
          redirect: () => ({ name: 'zone-ingress-list-view' }),
          name: 'zone-ingress-view',
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
                getTitle: (route) => route.params.zoneIngress as string,
                isBreadcrumb: true,
                breadcrumbTitleParam: 'zoneIngress',
              },
              component: () => import('@/app/zones/views/ZoneIngressDetailView.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/zone-egresses',
      name: 'zone-egress-abstract-view',
      children: [
        {
          path: '',
          meta: {
            title: 'Zone Egresses',
            isBreadcrumb: true,
          },
          redirect: () => ({ name: 'zone-egress-list-view' }),
          name: 'zone-egress-view',
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
                getTitle: (route) => route.params.zoneEgress as string,
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
