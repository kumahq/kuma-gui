<template>
  <div
    class="route-view"
    :data-testid="name"
  >
    <div
      v-if="!hasParent"
      id="application-route-announcer"
      ref="title"
      class="route-view-title visually-hidden"
      aria-live="assertive"
      aria-atomic="true"
    />
    <slot
      name="default"
      :t="t"
      :env="env"
      :can="can"
      :route="{
        update: routeUpdate,
        replace: routeReplace,
        params: routeParams,
        back: routerBack,
      }"
    />
  </div>
</template>
<script lang="ts" setup generic="T extends Record<string, string | number> = {}">
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
import type { UnwrapRef } from 'vue'
export type RouteView = {
  addTitle: (item: string, sym: Symbol) => void
  removeTitle: (sym: Symbol) => void
  addAttrs: (item: Record<string, string>, sym: Symbol) => void
  removeAttrs: (sym: Symbol) => void
}

const win = window
const env = useEnv()
const can = useCan()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const sym = Symbol('route-view')

type Params = { [K in keyof T]: string }
type RouteReplaceParams = Parameters<typeof router['push']>

const props = withDefaults(defineProps<{
  name: string
  attrs?: Record<string, string>
  params?: T
}>(), {
  attrs: () => ({}),
  params: () => { return {} as T },
})
const name = computed(() => props.name)

const title = ref<HTMLDivElement | null>(null)
const titles = new Map<Symbol, string>()
const attributes = new Map<Symbol, Record<string, string>>()
const setTitle = createTitleSetter(document)
const setAttrs = createAttrsSetter(document.documentElement)

const joinTitle = (titles: string[]) => {
  return titles.reverse().concat(t('components.route-view.title', { name: t('common.product.name') })).join(' | ')
}

const routeView = {
  addTitle: (item: string, sym: Symbol) => {
    const $title = title.value
    if ($title) {
      $title.innerHTML = t('components.route-view.route-announcer', { title: item })
    }

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
const routeParams = ref<Params>(props.params as Params)

watch(() => {
  return Object.keys(props.params).map((item) => { return route.params[item] || route.query[item] })
}, () => {
  const params = Object.entries({
    ...props.params,
    ...route.query,
    ...route.params,
  }).reduce<Record<string, string>>((prev, [prop, value]) => {
    // unless you explicitly specified a RouteView::param
    // then don't add the param to route.params
    if (typeof props.params[prop] === 'undefined') {
      return prev
    }
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
      param = String(def)
    }
    prev[prop] = decodeURIComponent(param)
    return prev
  }, {})
  routeParams.value = params as UnwrapRef<Params>
}, { immediate: true })

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
const routeReplace = (...args: RouteReplaceParams) => {
  router.push(...args)
}
const routerBack = (...args: RouteReplaceParams) => {
  try {
    if (win.history.state.back !== null) {
      router.back()
      return
    }
  } catch (_) {
    // passthrough
  }
  routeReplace(...args)
}

watch(() => props.name, () => {
  // we only want query params here
  const params = Object.entries(routeParams.value || {}).reduce<Record<string, string>>((prev, [key, value]) => {
    if (typeof route.params[key] === 'undefined') {
      prev[key] = value as string
    }
    return prev
  }, {})

  if (Object.keys(params).length > 0) {
    router.replace({
      query: cleanQuery(params, route.query),
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
