export { default as RouteTitle } from './route-title/RouteTitle.vue'
export { default as RouteView } from './route-view/RouteView.vue'
export const ROUTE_VIEW_ROOT = Symbol('route-view-root')
export const ROUTE_VIEW_PARENT = Symbol('route-view-parent')
import type { Ref } from 'vue'

export type RouteViewService = {
  name: string
  from: Ref
  addTitle: (item: string, sym: symbol) => void
  removeTitle: (sym: symbol) => void
  addAttrs: (item: Partial<Record<string, string>>, sym: symbol) => void
  removeAttrs: (sym: symbol) => void
}
