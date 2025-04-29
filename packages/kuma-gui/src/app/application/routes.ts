import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const routes = (notFoundViews: (() => Promise<Component>)[]): RouteRecordRaw[] => {
  return [
    {
      path: '404',
      name: 'app-not-found-view',
      alias: ':pathMatch(.*)*',
      component: () => notFoundViews[notFoundViews.length - 1](),
    },
  ]
}
