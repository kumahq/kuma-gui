<template>
  <PageLayout
    v-if="!hasParent"
    class="app-view"
    :title="``"
    :breadcrumbs="_breadcrumbs"
    :tabs="_tabs"
    v-bind="attrs"
  >
    <template #title-after>
      <XTeleportSlot
        :name="`app-view-title-slot`"
      />
    </template>
    <template
      #actions
    >
      <XTeleportSlot
        name="app-view-docs"
      />
      <slot name="actions">
        <XTeleportSlot
          :name="`${routeView.name}-actions`"
        />
      </slot>
    </template>
    <section>
      <XLayout
        variant="y-stack"
      >
        <slot
          name="default"
        />
      </XLayout>
    </section>
  </PageLayout>
  <template
    v-else
  >
    <section>
      <XLayout
        variant="y-stack"
      >
        <header
          v-if="slots.title || slots.actions"
          class="app-view-title-bar"
        >
          <template
            v-if="summary.length > 0"
          >
            <XTeleportTemplate
              :to="{ name: summary }"
            >
              <slot name="title" />
            </XTeleportTemplate>
          </template>
          <XTeleportTemplate
            v-else
            :to="{ name: `app-view-title-slot` }"
          >
            <slot name="title" />
          </XTeleportTemplate>

          <XLayout
            variant="action-group"
          >
            <slot name="actions">
              <XTeleportSlot
                :name="`${routeView.name}-actions`"
              />
            </slot>
          </XLayout>
        </header>
        <slot
          name="default"
        />
      </XLayout>
    </section>
  </template>

  <XTeleportTemplate
    v-if="props.docs.length > 0"
    :to="{ name: 'app-view-docs' }"
  >
    <XAction
      appearance="secondary"
      icon
      :href="props.docs"
    >
      <XIcon
        name="docs"
      />
    </XAction>
  </XTeleportTemplate>
</template>

<script lang="ts" setup>
import { PageLayout } from '@kong-ui-public/page-layout'
import { ROUTE_VIEW_PARENT } from '@kumahq/routing/vue'
import { provide, inject, watch, ref, onBeforeUnmount, useAttrs } from 'vue'

import type { PageLayoutProps, PageLayoutTab } from '@kong-ui-public/page-layout'
import type { RouteViewService } from '@kumahq/routing/vue'
import type { XBreadcrumbs } from '@kumahq/x'
import type { ComponentInstance } from 'vue'

type AppView = {
  addBreadcrumbs: (items: BreadcrumbItem[], sym: symbol) => void
  removeBreadcrumbs: (sym: symbol) => void
  setTabs: (tabs: PageLayoutTab[]) => void
  removeTabs: () => void
}
type BreadcrumbItem = ComponentInstance<typeof XBreadcrumbs>['$props']['items'][number]
type Breadcrumbs = Map<symbol, BreadcrumbItem[]>


const props = withDefaults(defineProps<Omit<PageLayoutProps, 'tabs' | 'breadcrumbs' | 'title'> & {
  breadcrumbs?: BreadcrumbItem[] | null
  tabs?: PageLayoutTab[] | null
  docs?: string
  notifications?: boolean
}>(), {
  breadcrumbs: null,
  tabs: null,
  docs: '',
  notifications: false,
})
const slots = defineSlots()

const attrs = useAttrs()
const routeView = inject<RouteViewService>(ROUTE_VIEW_PARENT)!

const summary: string = inject('app-summary-view', '')
provide('app-summary-view', '')

const map: Breadcrumbs = new Map()
const _title = ref('')
const _tabs = ref<PageLayoutTab[]>([])
const _breadcrumbs = ref<BreadcrumbItem[]>([])
const symbol = Symbol('app-view')

const refreshBreadcrumbs = (map: Breadcrumbs) => {
  const breadcrumbs = [...map.values()]
  if (!breadcrumbs.some(item => item.length === 0)) {
    _breadcrumbs.value = breadcrumbs.flat()
  } else {
    _breadcrumbs.value = []
  }
}

const appView: AppView = {
  addBreadcrumbs: (items: BreadcrumbItem[] | undefined, sym: symbol) => {
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
      refreshBreadcrumbs(map)
    }
  },
  removeBreadcrumbs: (sym: symbol) => {
    if (map.has(sym)) {
      map.delete(sym)
      refreshBreadcrumbs(map)
    }
  },
  setTabs: (items: PageLayoutTab[]) => {
    if (items.length === 0 || JSON.stringify(_tabs.value) === JSON.stringify(items)) {
      // if they are the same, don't refresh
      return
    }
    _tabs.value = items
  },
  removeTabs: () => {
    if (_tabs.value.length === 0) {
      return
    }
    _tabs.value = []
  },
}
const hasParent: AppView | undefined = inject('app-view-parent', undefined)
if (!hasParent) {
  provide('app-view-parent', appView)
}
const parent: AppView = inject('app-view-parent', appView)

watch(() => props.breadcrumbs, (items: BreadcrumbItem[] | null) => {
  if (items !== null) {
    parent.addBreadcrumbs(items, symbol)
  }
}, { immediate: true })
watch(() => props.tabs, (items?: PageLayoutTab[] | null) => {
  // props are only ever used instead of unmount seeing as we can't use unmount
  // so they are only used if they are `[]`
  // which we currently use as a signal to say "this AppView has no tabs"
  if(Array.isArray(items) && items.length === 0) {
    parent.removeTabs()
  }
}, { immediate: true })

onBeforeUnmount(() => {
  parent.removeBreadcrumbs(symbol)
})
</script>

<style lang="scss" scoped>
:deep(.title-after-container) {
  padding-left: 0 !important;
}
.app-view {
  font-size: var(--x-font-size-30);
}
.app-view-title-bar {
  display: flex;
  align-items: center;

  h1, h2, h3, h4, h5, h6  {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.notifications {
  padding: 0;
}
.notifications li {
  margin-left: var(--x-space-60);
}
.notifications li:only-child {
  list-style-type: none;
  padding: 0;
}
</style>
