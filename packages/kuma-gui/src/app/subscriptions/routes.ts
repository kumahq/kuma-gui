import type { RouteRecordRaw } from 'vue-router'
export const routes = (prefix: string): RouteRecordRaw[] => {
  return [
    {
      path: 'subscription/:subscription',
      name: `${prefix}-subscription-summary-view`,
      redirect: { name: `${prefix}-subscription-summary-overview-view` },
      props: () => ({
        routeName: `${prefix}-subscription-summary-view`,
      }),
      component: () => import('@/app/subscriptions/views/SubscriptionSummaryView.vue'),
      children: [
        {
          path: 'overview',
          name: `${prefix}-subscription-summary-overview-view`,
          props: () => ({
            routeName: `${prefix}-subscription-summary-overview-view`,
          }),
          component: () => import('@/app/subscriptions/views/SubscriptionSummaryOverviewView.vue'),
        },
        {
          path: 'config',
          name: `${prefix}-subscription-summary-config-view`,
          props: () => ({
            routeName: `${prefix}-subscription-summary-config-view`,
          }),
          component: () => import('@/app/subscriptions/views/SubscriptionSummaryConfigView.vue'),
        },
      ],
    },
  ]
}
