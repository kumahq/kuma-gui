<template>
  <div
    class="route-view"
  >
    <div
      v-if="!hasParent"
      class="route-view-title sr-only"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ t('components.route-view.route-announcer', {title: title}) }}
    </div>
    <slot
      name="default"
      :route="{
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
import { useRoute } from 'vue-router'

import { ROUTE_VIEW_PARENT } from '.'
import { urlParam, createAttrsSetter, createTitleSetter } from '../../utilities'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const route = useRoute()
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
