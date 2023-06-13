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

    <slot name="default" />
  </MainView>
  <slot
    v-else
    name="default"
  />
</template>
<script lang="ts" setup>
import { KBreadcrumbs, BreadcrumbItem } from '@kong/kongponents'
import { provide, inject, PropType, watch, ref, onBeforeUnmount } from 'vue'

import { useMainView } from '@/components'

type AppView = {
  addBreadcrumbs: (items: BreadcrumbItem[], sym: Symbol) => void
  removeBreadcrumbs: (sym: Symbol) => void
}
type Breadcrumbs = Map<Symbol, BreadcrumbItem[]>
const MainView = useMainView()

const props = defineProps({
  breadcrumbs: {
    type: Array as PropType<BreadcrumbItem[]>,
    required: false,
    default: null,
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
