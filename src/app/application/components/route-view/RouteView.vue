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
<script lang="ts" setup generic="T extends Record<string, string | number | boolean> = {}">
import { computed, provide, inject, ref, watch, onBeforeUnmount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ROUTE_VIEW_PARENT } from '.'
import { useCan, useI18n } from '../../index'
import {
  urlParam,
  normalizeUrlParam,
  cleanQuery,
  createAttrsSetter,
  createTitleSetter,
  beforePaint,
} from '../../utilities'
import { useEnv } from '@/utilities'
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

type Params = { [P in keyof T]: T[P] }
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
const routeParams = reactive<Params>(structuredClone(props.params) as Params)

// Updates the URL for route params if used as a modelValue (for boolean props only)
watch(routeParams, (val) => {
  const booleans = Object.fromEntries(Object.entries(val).filter(([key, _value]) => {
    return typeof props.params[key] === 'boolean'
  }))
  if (Object.keys(booleans).length > 0) {
    routeUpdate(booleans)
  }
})

// when any URL params change, normalize/validate/default and reset our actual application params
watch(() => {
  return Object.keys(props.params).map((item) => { return route.params[item] || route.query[item] })
}, () => {
  const params = {
    ...route.query,
    ...route.params,
  }
  Object.entries({
    ...props.params,
  }).reduce((prev, [prop, def]) => {
    const param = urlParam(typeof params[prop] === 'undefined' ? '' : params[prop])
    prev[prop] = normalizeUrlParam(param, def)
    return prev
  }, routeParams as Record<string, string | number | boolean>)
}, { immediate: true })

watch(() => props.name, () => {
  // we only want query params here
  const params = Object.entries(routeParams || {}).reduce((prev, [key, value]) => {
    if (typeof route.params[key] === 'undefined') {
      prev[key] = value
    }
    return prev
  }, {} as Record<string, string | boolean | undefined>)
  if (Object.keys(params).length > 0) {
    router.replace({
      query: cleanQuery(params, route.query),
    })
  }
}, { immediate: true })

let newParams: Record<string, string | boolean | undefined> = {}
const routerPush = beforePaint((params: Record<string, string | boolean | undefined>) => {
  router.push({
    name: props.name,
    query: cleanQuery(params, route.query),
  })
  newParams = {}
})
const routeUpdate = (params: Record<string, string | boolean | undefined>) => {
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
