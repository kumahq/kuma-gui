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
      }, {
        cacheControl: 'no-cache',
      })"
      @change="resolve"
      v-slot="{ data: me }"
    >
      <slot
        v-if="me && submit && redirected"
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
          from: getFrom,
        }"
      />
    </DataSource>
  </div>
</template>
<script lang="ts" setup generic="T extends Record<string, string | number | boolean | typeof Number | typeof String | typeof Boolean> = {}">
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
  addTitle: (item: string, sym: symbol) => void
  removeTitle: (sym: symbol) => void
  addAttrs: (item: Partial<Record<string, string>>, sym: symbol) => void
  removeAttrs: (sym: symbol) => void
}

type StringNamedRouteRecordRaw = RouteRecordRaw & {
  name: string
}

const win = window
const env = useEnv()
const can = useCan()
const uri = useUri()

let resolve: (resolved: object) => void
const meResponse = new Promise((r) => {
  resolve = r
})

const htmlAttrs = useAttrs()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const sym = Symbol('route-view')

type PrimitiveParams = Record<string, string | number | boolean>
type Params = {
  [P in keyof T]:
  T[P] extends NumberConstructor ? number :
    T[P] extends StringConstructor ? string :
      T[P] extends BooleanConstructor ? boolean :
        T[P]
}
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
const titles = new Map<symbol, string>()
const attributes = new Map<symbol, SupportedAttrs>()
const from = ref<RouteLocationNormalizedLoaded | undefined>()
const getFrom = () => from.value

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
  addTitle: (item: string, sym: symbol) => {
    const $title = title.value
    if ($title) {
      $title.textContent = t('components.route-view.route-announcer', { title: item })
    }

    titles.set(sym, item)
    setTitle(joinTitle([...titles.values()]))
  },
  removeTitle: (sym: symbol) => {
    titles.delete(sym)
    setTitle(joinTitle([...titles.values()]))
  },
  addAttrs: (item: SupportedAttrs, sym: symbol) => {
    attributes.set(sym, item)
    setAttrs([...attributes.values()])
  },
  removeAttrs: (sym: symbol) => {
    attributes.delete(sym)
    setAttrs([...attributes.values()])
  },
}
const routeParams = reactive<Params>({} as Params)

// when any URL params change, normalize/validate/default and reset our actual application params
const redirected = ref<boolean>(false)

let local = {}
watch(() => {
  return Object.keys(props.params).map((item) => { return route.params[item] || route.query[item] })
}, async () => {
  const me = get(await meResponse, 'params', {})

  // merge params in order of importance/priority:
  // 1. Anything stored by the user in storage
  // 2. URL query params
  // 3. URL path params
  const params = {
    ...me,
    ...local,
    ...Object.fromEntries(Object.entries(route.query).filter(([_, val]) => (typeof val !== 'undefined' && typeof val !== 'string') || val?.length > 0)),
    ...route.params,
  }

  // normalize/validate/default all params using the RouteView :params
  // 1. Ignore any `?param[]=0` type params, we just take the first one
  // 2. Using normalizeUrlParam and the type information from RouteView :params convert things to the correct type i.e. null > false
  // 3. Use RouteView :params to set any params that are empty, i.e. use RouteView :params as defaults.
  Object.entries(props.params).reduce((prev, [prop, def]) => {
    const param = urlParam(typeof params[prop] === 'undefined' ? '' : params[prop])
    prev[prop] = normalizeUrlParam(param, def)
    return prev
  }, routeParams as PrimitiveParams)

  // only one first load, if any params are missing from the URL/query
  // redirect/add the query params to the URL.
  // this ensures any JS applied defaults are reflected in the URL
  const _params = Object.entries(routeParams || {}).reduce((prev, [key, value]) => {
    if (typeof route.params[key] === 'undefined') {
      prev[key] = value
    }
    return prev
  }, {} as Partial<PrimitiveParams>)
  if(Object.keys(_params).length > 0) {
    // we only want query params here
    router.replace({
      query: cleanQuery(_params, route.query),
    })
  }
  redirected.value = true
}, { immediate: true })

let newParams: Partial<PrimitiveParams> = {}
const routeUpdate = (params: Partial<PrimitiveParams>): void => {
  newParams = {
    ...newParams,
    ...params,
  }
  // we look for special Number and String RouteView::params and if we find
  // them we store them locally and also send them to user storage we store
  // them locally, instead of saving them in storage and then refreshing to
  // avoid causing any re-renders due to the refreshed DataSource
  // TODO: ideally we wouldn't have locally stored state like this, and we
  // would instead use a single source of truth which in this case would be
  // localStorage
  local = Object.entries(params).reduce((prev, [key, value]) => {
    if([Number, String, Boolean].some(item => props.params[key] === item)) {
      prev[key] = value
    }
    return prev
  }, {} as Partial<PrimitiveParams>)

  if(Object.keys(local).length > 0) {
    submit.value({ params: local, $global: true })
  }
  routerPush(newParams)
}
const routerPush = (params: Partial<PrimitiveParams>) => {
  router.push({
    query: cleanQuery(params, route.query),
  })
  newParams = {}
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
  } catch {
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
