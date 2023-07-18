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
        <KIcon
          v-if="props.fullscreen"
          icon="kong"
        />
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
        <KIcon
          v-if="props.fullscreen"
          icon="kong"
        />
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
  </template>
</template>
<script lang="ts" setup>
import {
  KBreadcrumbs,
  BreadcrumbItem,
  KIcon,
} from '@kong/kongponents'
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
}
.app-view-title-bar {
  h1, h2, h3, h4, h5, h6  {
    color: var(--black-500);
    line-height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.app-view-title-bar h1 {
  font-size: var(--type-xxxl, 32px);
}
.app-view-title-bar h2 {
  font-size: var(--type-xl, 22px);
}
.is-fullscreen {
  .app-view-title-bar {
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--grey-300);
  }
  .app-view-title-bar h1 {
    margin-left: var(--spacing-xs);
    padding-left: var(--spacing-xs);
    border-left: 1px solid var(--grey-300);
    font-size: 20px;
  }
}
</style>

<style lang="scss" scoped>
.actions {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-md);
}

</style>
