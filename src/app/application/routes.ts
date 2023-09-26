import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (notFoundViews: (() => Promise<Component>)[]): RouteRecordRaw[] => {
  return [
    {
      path: '/404',
      name: 'not-found',
      alias: '/:pathMatch(.*)*',
      meta: {
        title: 'Item not found',
      },
      component: () => notFoundViews[notFoundViews.length - 1](),
    },
  ]
}
