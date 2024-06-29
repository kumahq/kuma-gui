import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: 'subscription/:subscription',
      name: 'subscription-summary-view',
      redirect: { name: 'subscription-summary-overview-view' },
      component: () => import('@/app/subscriptions/views/SubscriptionSummaryView.vue'),
      children: [
        {
          path: 'overview',
          name: 'subscription-summary-overview-view',
          component: () => import('@/app/subscriptions/views/SubscriptionSummaryOverviewView.vue'),
        },
        {
          path: 'config',
          name: 'subscription-summary-config-view',
          component: () => import('@/app/subscriptions/views/SubscriptionSummaryConfigView.vue'),
        },
      ],
    },
  ]
}
