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
        update: routeUpdate,
        replace: routeReplace,
        params: routeParams
      }"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, provide, inject, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ROUTE_VIEW_PARENT } from '.'
import { useCan } from '../../index'
import {
  urlParam,
  cleanQuery,
  createAttrsSetter,
  createTitleSetter,
  beforePaint,
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
    required: true,
  },
  attrs: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  params: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const routeParams = computed(() => {
  const params = Object.fromEntries(Object.entries({
    ...props.params,
    ...route.params,
    ...route.query,
  }).map(([prop, value]) => {
    let param = urlParam(value)
    const def = props.params[prop]
    switch (true) {
      // if the defined param is a number check to see that the query param
      // one can pass as a number and if not provide the default instead
      case typeof def === 'number':
        if (isNaN(Number(value))) {
          param = String(def)
        }
        break
    }
    if (param.length === 0) {
      param = def
    }
    return [
      prop,
      decodeURIComponent(param),
    ]
  }))
  return params
})

let newParams = {}
const routerPush = beforePaint((params: Record<string, string | undefined>) => {
  router.push({
    name: props.name,
    query: cleanQuery(params, route.query),
  })
  newParams = {}
})
const routeUpdate = (params: Record<string, string | undefined>) => {
  newParams = {
    ...newParams,
    ...params,
  }
  routerPush(newParams)
}
const routeReplace = (...args: Parameters<typeof router['push']>) => {
  router.push(...args)
}
watch(() => props.name, (name) => {
  if (Object.keys(props.params).length > 0) {
    router.replace({
      name,
      query: cleanQuery(routeParams.value, route.query),
    })
  }
}, { immediate: true })

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
