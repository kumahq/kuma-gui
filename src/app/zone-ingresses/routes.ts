import type { RouteRecordRaw } from 'vue-router'

export const routes = (prefix = 'ingresses') => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}/:zoneIngress`,
        name: 'zone-ingress-detail-tabs-view',
        component: () => import('@/app/zone-ingresses/views/item/IndexView.vue'),
        redirect: { name: 'zone-ingress-detail-view' },
        children: [
          {
            path: 'overview',
            name: 'zone-ingress-detail-view',
            component: () => import('@/app/zone-ingresses/views/item/DetailView.vue'),
          },
          {
            path: 'services',
            name: 'zone-ingress-services-view',
            component: () => import('@/app/zone-ingresses/views/item/ServicesView.vue'),
          },
          {
            path: 'xds-config',
            name: 'zone-ingress-xds-config-view',
            component: () => import('@/app/zone-ingresses/views/item/XdsConfigView.vue'),
          },
          {
            path: 'stats',
            name: 'zone-ingress-stats-view',
            component: () => import('@/app/zone-ingresses/views/item/StatsView.vue'),
          },
          {
            path: 'clusters',
            name: 'zone-ingress-clusters-view',
            component: () => import('@/app/zone-ingresses/views/item/ClustersView.vue'),
          },
          {
            path: 'config',
            name: 'zone-ingress-config-view',
            component: () => import('@/app/zone-ingresses/views/item/ConfigView.vue'),
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
          component: () => import('@/app/zone-ingresses/views/IndexView.vue'),
        },
      ]
    },
    item,
  }
}
