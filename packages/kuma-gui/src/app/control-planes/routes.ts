import { useProtocolHandler } from '@kumahq/x'

import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from '@/app/vue'

export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '',
      name: 'control-plane-root-view',
      component: () => import('@/app/control-planes/views/ControlPlaneRootView.vue'),
      redirect: { name: 'control-plane-detail-view' },
      children: [
        {
          path: '',
          name: 'control-plane-detail-view',
          component: () => import('@/app/control-planes/views/ControlPlaneDetailView.vue'),
        },
      ],
    },
    {
      path: ':kri(kri_.*)',
      name: 'control-plan-kri-redirect-view',
      beforeEnter: (to) => {
        const protocolHandler = useProtocolHandler()
        const base = useRouter().options.history.base
        const href = protocolHandler(`kri://${to.params.kri}`)
        // protocolHandler returns a base-prefixed href but guard redirects are relative to the base so we need to strip that away
        return href.startsWith(base) ? href.substring(base.length) || '/' : href
      },
      children: [],
    },
  ]
}

