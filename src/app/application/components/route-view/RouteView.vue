<template>
  <div
    class="route-view"
    v-bind="htmlAttrs"
    :data-testid="name"
  >
    <div
      v-if="!hasRoot"
      id="application-route-announcer"
      ref="title"
      class="route-view-title visually-hidden"
      aria-live="assertive"
      aria-atomic="true"
    />
    <DataSink
      :src="`/me/${props.name}`"
      v-slot="{ submit: _submit }"
    >
      <!-- eslint-disable vue/no-lone-template -->
      <template
        :ref="() => {
          submit = _submit
        }"
      />
    </DataSink>
    <DataSource
      :src="uri(sources, '/me/:route', {
        route: props.name,
      })"
      v-slot="{ data: me }"
    >
      <slot
        v-if="me && submit"
        :id="UniqueId"
        name="default"
        :t="t"
        :env="env"
        :me="{ data: me, set: submit, get: (uri: string, d: unknown = {}) => get(me, uri, d) }"
        :can="can"
        :uri="uri"
        :route="{
          name: props.name,
          update: routeUpdate,
          replace: routeReplace,
          params: routeParams,
          back: routerBack,
          children,
          child,
          from,
        }"
      />
    </DataSource>
  </div>
</template>
<script lang="ts" setup generic="T extends Record<string, string | number | boolean> = {}">
import { computed, provide, inject, ref, watch, onBeforeUnmount, reactive, useAttrs } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ROUTE_VIEW_PARENT, ROUTE_VIEW_ROOT } from '.'
import { useCan, useI18n, uniqueId, useEnv, get } from '../../index'
import {
  urlParam,
  normalizeUrlParam,
  cleanQuery,
  createAttrsSetter,
  createTitleSetter,
  beforePaint,
} from '../../utilities'
import DataSink from '../data-source/DataSink.vue'
import DataSource from '../data-source/DataSource.vue'
import { useUri } from '@/app/application/services/data-source'
import { sources } from '@/app/me/sources'
import type { Ref } from 'vue'
import type { RouteRecordRaw, RouteLocationNormalizedLoaded } from 'vue-router'

export type RouteView = {
  name: string
  from: Ref
  addTitle: (item: string, sym: Symbol) => void
  removeTitle: (sym: Symbol) => void
  addAttrs: (item: Partial<Record<string, string>>, sym: Symbol) => void
  removeAttrs: (sym: Symbol) => void
}

type StringNamedRouteRecordRaw = RouteRecordRaw & {
  name: string
}

const win = window
const env = useEnv()
const can = useCan()
const uri = useUri()
const htmlAttrs = useAttrs()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const sym = Symbol('route-view')

type Params = { [P in keyof T]: T[P] }
type RouteReplaceParams = Parameters<typeof router['push']>

const setTitle = createTitleSetter(document)
const setAttrs = createAttrsSetter(document.documentElement)
type SupportedAttrs = Parameters<typeof setAttrs>[0][number]

const props = withDefaults(defineProps<{
  name: string
  attrs?: SupportedAttrs
  params?: T
}>(), {
  attrs: (): SupportedAttrs => ({}),
  params: () => { return {} as T },
})
const _id = uniqueId(props.name)
class UniqueId {
  static toString() {
    return _id
  }

  toString() {
    return uniqueId(props.name)
  }
}

const name = computed(() => props.name)
const submit = ref((_args: any) => {})
const title = ref<HTMLDivElement | null>(null)
const titles = new Map<Symbol, string>()
const attributes = new Map<Symbol, SupportedAttrs>()
const from = ref<RouteLocationNormalizedLoaded | undefined>()

const joinTitle = (titles: string[]) => {
  return titles.reverse().concat(t('components.route-view.title', { name: t('common.product.name') })).join(' | ')
}
const children: StringNamedRouteRecordRaw[] = (router.getRoutes().find((route) => route.name === name.value)?.children.map(item => {
  item.name = String(item.name)
  return item as StringNamedRouteRecordRaw
}) ?? [])
const child = () => {
  const matched = route.matched.map(item => item.name)
  return children.find((item) => matched.includes(item.name))
}

const routeView = {
  name: props.name,
  from,
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
  addAttrs: (item: SupportedAttrs, sym: Symbol) => {
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
  if (route.name === props.name) {
    const booleans = Object.fromEntries(Object.entries(val).filter(([key, _value]) => {
      return typeof props.params[key] === 'boolean'
    }))
    if (Object.keys(booleans).length > 0) {
      routeUpdate(booleans)
    }
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

type RouteParams = Record<string, string | boolean | number | undefined>
let newParams: RouteParams = {}
const routerPush = beforePaint((params: RouteParams) => {
  router.push({
    name: props.name,
    query: cleanQuery(params, route.query),
  })
  newParams = {}
})
const routeUpdate = (params: RouteParams): void => {
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

const hasRoot: RouteView | undefined = inject(ROUTE_VIEW_ROOT, undefined)
if (!hasRoot) {
  // use the default title if we are the topmost RouteView
  setTitle(t('components.route-view.title', { name: t('common.product.name') }))
  // listen for to our navigations so we can set route.from
  router.beforeEach((_to, f) => {
    from.value = f
    return true
  })
  // add the root so all other RouteView are marked as children
  provide(ROUTE_VIEW_ROOT, routeView)
}
// add RouteTitle's parent
provide(ROUTE_VIEW_PARENT, routeView)
//
const root: RouteView = hasRoot || routeView

watch(() => props.attrs, (attrs) => {
  if (Object.keys(attrs).length > 0) {
    root.addAttrs(attrs, sym)
  }
}, { immediate: true })

if (hasRoot) {
  watch(() => root.from, (val) => {
    from.value = val.value
  }, { immediate: true })
}

onBeforeUnmount(() => {
  root.removeAttrs(sym)
})
</script>
