<template>
  <div
    class="route-view"
  >
    <div
      v-if="!hasParent"
      class="route-view-title visually-hidden"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ t('components.route-view.route-announcer', {title: title}) }}
    </div>
    <slot
      name="default"
      :t="t"
      :env="env"
      :can="can"
      :route="{
        update: (params: Record<string, string | undefined>) => {
          // Avoids `router.push` specifically in the case where we try to persist the `page` query parameter in the URL while there isn’t one already. This happens when navigating to a list view through the UI (i.e. without directly using the `page` query parameter). If we use `router.push`, this creates a second history entry after that navigation which makes it near impossible to navigate back through the history because the browser will be stuck in a loop.
          const method = !Boolean(route.query.page) ? 'replace' : 'push'
          router[method]({
            name: props.name,
            query: cleanQuery(params, route.query),
          })
        },
        replace: (...args: Parameters<typeof router['push']>) => {
          router.push(...args)
        },
        params: Object.fromEntries(Object.entries(route.params).map(([prop, value]) => {
          return [
            prop,
            urlParam(value)
          ]
        }))
      }"
    />
  </div>
</template>
<script lang="ts" setup>
import { provide, inject, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ROUTE_VIEW_PARENT } from '.'
import { useCan } from '../../index'
import {
  urlParam,
  cleanQuery,
  createAttrsSetter,
  createTitleSetter,
} from '../../utilities'
import { useI18n, useEnv } from '@/utilities'

const env = useEnv()
const can = useCan()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const setTitle = createTitleSetter(document)
const setAttrs = createAttrsSetter(document.documentElement)
const sym = Symbol('route-view')

const title = ref<string>('')
const titles = new Map<Symbol, string>()
const attributes = new Map<Symbol, Record<string, string>>()

const joinTitle = (titles: string[]) => {
  return titles.reverse().concat(t('components.route-view.title', { name: t('common.product.name') })).join(' | ')
}
const routeView = {
  addTitle: (item: string, sym: Symbol) => {
    title.value = item
    titles.set(sym, item)
    setTitle(joinTitle([...titles.values()]))
  },
  removeTitle: (sym: Symbol) => {
    titles.delete(sym)
    setTitle(joinTitle([...titles.values()]))
  },
  addAttrs: (item: Record<string, string>, sym: Symbol) => {
    attributes.set(sym, item)
    setAttrs([...attributes.values()])
  },
  removeAttrs: (sym: Symbol) => {
    attributes.delete(sym)
    setAttrs([...attributes.values()])
  },
}
export type RouteView = typeof routeView

const props = defineProps({
  name: {
    type: String,
    // once we have rolled out naming everywhere we can change this to required
    required: false,
    default: '',
  },
  attrs: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const hasParent: RouteView | undefined = inject(ROUTE_VIEW_PARENT, undefined)
if (!hasParent) {
  // use the default title if we are the topmost RouteView
  setTitle(t('components.route-view.title', { name: t('common.product.name') }))
  provide(ROUTE_VIEW_PARENT, routeView)
}
const parent: RouteView = hasParent || routeView

watch(() => props.attrs, (attrs) => {
  if (Object.keys(attrs).length > 0) {
    parent.addAttrs(attrs, sym)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  parent.removeAttrs(sym)
})
</script>
