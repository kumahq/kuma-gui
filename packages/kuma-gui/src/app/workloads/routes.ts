import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const item = (): RouteRecordRaw[] => {
    return [
      {
        name: 'workload-detail-tabs-view',
        path: 'workloads/:wl',
        component: () => import('@/app/workloads/views/WorkloadDetailTabsView.vue'),
        children: [
          {
            name: 'workload-detail-view',
            path: 'overview',
            component: () => import('@/app/workloads/views/WorkloadDetailView.vue'),
          },
          {
            name: 'workload-config-view',
            path: 'config',
            component: () => import('@/app/workloads/views/WorkloadConfigView.vue'),
          },
        ],
      },
    ]
  }

  const summary = (): RouteRecordRaw[] => {
    return [
      {
        path: ':wl',
        name: 'workload-summary-view',
        component: () => import('@/app/workloads/views/WorkloadSummaryView.vue'),
      },
    ]
  }

  return {
    items: (): RouteRecordRaw[] => {
      return [
        {
          path: 'workloads',
          name: 'workload-list-view',
          component: () => import('@/app/workloads/views/WorkloadListView.vue'),
          children: [...summary()],
        },
      ]
    },
    item,
    summary,
  }
}
