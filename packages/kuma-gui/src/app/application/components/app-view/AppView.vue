<template>
  <div
    class="app-view"
  >
    <DataSource
      :src="`/me/~notifications`"
      v-slot="{ data: dismissed, refresh }"
    >
      <DataSink
        :src="`/me/~notifications/reset`"
        v-slot="{ submit: reset }"
      >
        <DataSink
          :src="`/me/~notifications/dismiss`"
          v-slot="{ submit: dismiss }"
        >
          <component
            :is="props.notifications ? `XNotificationHub` : `XAnonymous`"
            v-if="dismissed"
            :uri="id"
            :dismissed="dismissed"
            @reset="(str: string) => reset([str])"
            v-slot="hub"
          >
            <XLayout
              type="stack"
              size="small"
            >
              <aside
                v-if="hub?.notifications?.size > 0"
              >
                <XLayout
                  type="stack"
                >
                  <template
                    v-for="[variant, value] in hub.notifications"
                    :key="variant"
                  >
                    <XAlert
                      :variant="variant"
                      @dismiss="async () => {
                        dismiss(Array.from(value))
                        await nextTick()
                        refresh()
                      }"
                    >
                      <ul
                        class="notifications"
                      >
                        <li
                          v-for="notification in value"
                          :key="notification"
                          :data-testid="`notification-${notification}`"
                        >
                          <XNotification
                            :uri="notification"
                          />
                        </li>
                      </ul>
                    </XAlert>
                  </template>
                </XLayout>
              </aside>

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
                <XLayout
                  type="stack"
                >
                  <header
                    v-if="slots.title || slots.actions"
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
                        v-if="slots.title"
                        name="app-view-docs"
                      />
                      <slot name="actions">
                        <XTeleportSlot
                          :name="`${routeView.name}-actions`"
                        />
                      </slot>
                    </div>
                  </header>

                  <slot
                    name="default"
                  />
                </XLayout>
              </section>
            </XLayout>
          </component>
        </DataSink>
      </DataSink>
    </DataSource>
  </div>
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
import { KongIcon } from '@kong/icons'
import { nextTick , provide, inject, watch, ref, onBeforeUnmount } from 'vue'

import { ROUTE_VIEW_PARENT } from '../route-view/index'
import type { RouteView } from '../route-view/RouteView.vue'
import { uniqueId } from '@/app/application'
import type { BreadcrumbItem } from '@kong/kongponents'
type AppView = {
  addBreadcrumbs: (items: BreadcrumbItem[], sym: symbol) => void
  removeBreadcrumbs: (sym: symbol) => void
}
type Breadcrumbs = Map<symbol, BreadcrumbItem[]>


const props = withDefaults(defineProps<{
  breadcrumbs?: BreadcrumbItem[] | null
  fullscreen?: boolean
  docs?: string
  notifications?: boolean
}>(), {
  breadcrumbs: null,
  fullscreen: false,
  docs: '',
  notifications: false,
})
const slots = defineSlots()

const id = uniqueId('app-view')
const routeView = inject<RouteView>(ROUTE_VIEW_PARENT)!

const summary: string = inject('app-summary-view', '')
provide('app-summary-view', '')
const map: Breadcrumbs = new Map()
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
.notifications {
  padding: 0;
}
.notifications li {
  margin-left: $kui-space-60;
}
.notifications li:only-child {
  list-style-type: none;
  padding: 0;
}
</style>
