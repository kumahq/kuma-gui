<template>
  <div
    class="app-view"
  >
    <nav
      v-if="!hasParent && _breadcrumbs.length > 0"
      aria-label="Breadcrumb"
    >
      <XBreadcrumbs
        :items="_breadcrumbs"
      />
    </nav>

    <section
      :class="{
        'is-fullscreen': props.fullscreen,
      }"
    >
      <header
        v-if="$slots.title || $slots.actions"
        class="app-view-title-bar"
      >
        <KongIcon v-if="props.fullscreen" />

        <template
          v-if="summary.length > 0"
        >
          <XTeleportTemplate
            :to="{ name: summary }"
          >
            <slot name="title" />
          </XTeleportTemplate>
        </template>
        <template
          v-else
        >
          <slot name="title" />
        </template>

        <div
          class="actions"
        >
          <XTeleportSlot
            v-if="$slots.title"
            name="app-view-docs"
          />
          <slot name="actions">
            <XTeleportSlot :name="`${routeView.name}-actions`" />
          </slot>
        </div>
      </header>

      <aside v-if="$slots.notifications">
        <XAlert
          class="mb-4"
          appearance="warning"
        >
          <slot name="notifications" />
        </XAlert>
      </aside>
      <XLayout
        type="stack"
      >
        <slot
          name="default"
        />
      </XLayout>
    </section>
  </div>
  <XTeleportTemplate
    v-if="props.docs.length > 0"
    :to="{ name: 'app-view-docs' }"
  >
    <KButton
      appearance="secondary"
      icon
      :to="props.docs"
    >
      <XIcon
        name="docs"
      />
    </KButton>
  </XTeleportTemplate>
</template>

<script lang="ts" setup>
import { KongIcon } from '@kong/icons'
import { provide, inject, watch, ref, onBeforeUnmount } from 'vue'

import { ROUTE_VIEW_PARENT } from '../route-view/index'
import type { RouteView } from '../route-view/RouteView.vue'
import type { BreadcrumbItem } from '@kong/kongponents'
type AppView = {
  addBreadcrumbs: (items: BreadcrumbItem[], sym: Symbol) => void
  removeBreadcrumbs: (sym: Symbol) => void
}
type Breadcrumbs = Map<Symbol, BreadcrumbItem[]>

const routeView = inject<RouteView>(ROUTE_VIEW_PARENT)!

const summary: string = inject('app-summary-view', '')
provide('app-summary-view', '')

const props = withDefaults(defineProps<{
  breadcrumbs?: BreadcrumbItem[] | null
  fullscreen?: boolean
  docs?: string
}>(), {
  breadcrumbs: null,
  fullscreen: false,
  docs: '',
})

const map: Breadcrumbs = new Map()
const _breadcrumbs = ref<BreadcrumbItem[]>([])
const symbol = Symbol('app-view')

const refresh = (map: Breadcrumbs) => {
  const breadcrumbs = [...map.values()]
  if (!breadcrumbs.some(item => item.length === 0)) {
    _breadcrumbs.value = breadcrumbs.flat()
  } else {
    _breadcrumbs.value = []
  }
}

const appView: AppView = {
  addBreadcrumbs: (items: BreadcrumbItem[] | undefined, sym: Symbol) => {
    if (typeof items !== 'undefined') {
      if (map.has(sym)) {
        const current = map.get(sym)
        // if we already have a record for this component we might be mutating,
        // so check for equality JSON.stringify is probably best/fastest/ok
        // seeing as order of things is highly unlikely to change
        if (JSON.stringify(current) === JSON.stringify(items)) {
          // if they are the same, don't refresh
          return
        }
      }
      map.set(sym, items)
      refresh(map)
    }
  },
  removeBreadcrumbs: (sym: Symbol) => {
    if (map.has(sym)) {
      map.delete(sym)
      refresh(map)
    }
  },
}
const hasParent: AppView | undefined = inject('app-view-parent', undefined)
if (!hasParent) {
  provide('app-view-parent', appView)
}
const parent: AppView = hasParent || appView

watch(() => props.breadcrumbs, (items: BreadcrumbItem[] | null) => {
  if (items !== null) {
    parent.addBreadcrumbs(items, symbol)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  parent.removeBreadcrumbs(symbol)
})
</script>

<style lang="scss">
.k-breadcrumbs {
  margin-bottom: 0 !important;
  position: relative;
  left: -3px;
}
.is-fullscreen {
  .app-view-title-bar {
    padding: $kui-space-80 $kui-space-90;
    border-bottom: $kui-border-width-10 solid $kui-color-border;
  }
  .app-view-title-bar h1 {
    margin-left: $kui-space-40;
    padding-left: $kui-space-40;
    border-left: $kui-border-width-10 solid $kui-color-border;
    font-size: $kui-font-size-60;
  }
}
.k-tabs + .route-view > .app-view .app-view-title-bar {
  margin-bottom: 20px;
}
</style>

<style lang="scss" scoped>
.app-view {
  font-size: $kui-font-size-30;
}
.app-view-title-bar {
  display: flex;
  align-items: center;
  margin-top: $kui-space-30;
  margin-bottom: calc($kui-space-80 + 4px);

  h1, h2, h3, h4, h5, h6  {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.actions {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: $kui-space-60;
}
</style>
