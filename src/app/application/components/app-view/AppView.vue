<template>
  <MainView
    v-if="!hasParent"
    class="app-main-content"
  >
    <nav
      v-if="_breadcrumbs.length > 0"
      aria-label="Breadcrumb"
    >
      <KBreadcrumbs
        :items="_breadcrumbs"
      />
    </nav>
    <section
      :class="{
        'is-fullscreen': props.fullscreen
      }"
    >
      <header
        v-if="slots.title"
        class="app-view-title-bar"
      >
        <KongIcon v-if="props.fullscreen" />

        <slot
          name="title"
        />
        <div
          v-if="slots.actions"
          class="actions"
        >
          <slot name="actions" />
        </div>
      </header>
      <slot name="default" />
    </section>
  </MainView>
  <template
    v-else
  >
    <section
      :class="{
        'is-fullscreen': props.fullscreen
      }"
    >
      <header
        v-if="slots.title"
        class="app-view-title-bar"
      >
        <KongIcon v-if="props.fullscreen" />

        <slot
          name="title"
        />
        <div
          v-if="slots.actions"
          class="actions"
        >
          <slot name="actions" />
        </div>
      </header>
      <aside>
        <template
          v-if="slots.notifications"
        >
          <KAlert
            class="mb-4"
            appearance="warning"
          >
            <template #alertMessage>
              <slot
                name="notifications"
              />
            </template>
          </KAlert>
        </template>
      </aside>
      <slot name="default" />
    </section>
  </template>
</template>
<script lang="ts" setup>
import { KongIcon } from '@kong/icons'
import { KBreadcrumbs, BreadcrumbItem } from '@kong/kongponents'
import { provide, inject, PropType, watch, ref, onBeforeUnmount, useSlots } from 'vue'

import { useMainView } from '@/components'

type AppView = {
  addBreadcrumbs: (items: BreadcrumbItem[], sym: Symbol) => void
  removeBreadcrumbs: (sym: Symbol) => void
}
type Breadcrumbs = Map<Symbol, BreadcrumbItem[]>
const MainView = useMainView()
const slots = useSlots()

const props = defineProps({
  breadcrumbs: {
    type: Array as PropType<BreadcrumbItem[]>,
    required: false,
    default: null,
  },
  fullscreen: {
    type: Boolean,
    required: false,
    default: false,
  },
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
      map.set(sym, items)
      refresh(map)
    }
  },
  removeBreadcrumbs: (sym: Symbol) => {
    map.delete(sym)
    refresh(map)
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
.app-view-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* 2rem */

  h1, h2, h3, h4, h5, h6  {
    line-height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.app-view-title-bar h1 {
  line-height: 1.3;
  font-weight: $kui-font-weight-semibold;
  font-size: $kui-font-size-80;
}
.app-view-title-bar h2 {
  font-size: $kui-font-size-60;
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
</style>

<style lang="scss" scoped>
.actions {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: $kui-space-60;
}

</style>
