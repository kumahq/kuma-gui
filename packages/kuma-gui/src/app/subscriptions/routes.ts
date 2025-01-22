import type { RouteRecordRaw } from 'vue-router'
export const routes = (prefix: string): RouteRecordRaw[] => {
  return [
    {
      path: 'subscription/:subscription',
      name: `${prefix}-subscription-summary-view`,
      component: () => import('@/app/subscriptions/views/SubscriptionSummaryView.vue'),
    },
  ]
}
