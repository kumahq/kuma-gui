<template>
  <template
    v-for="item in items"
  >
    <slot
      :name="`${item.title}-tab`"
    />
  </template>
</template>
<script lang="ts" setup>
import { computed, watch, inject, provide } from 'vue'
import { useRouter } from 'vue-router'

import type { Tab } from '@kong/kongponents'
import type { PageLayoutTab } from '@kong-ui-public/page-layout'
import type { RouteLocationNamedRaw } from 'vue-router'


type AppView = {
  setTabs: (tabs: PageLayoutTab[]) => void
}

const props = withDefaults(defineProps<{
  selected?: string
}>(), {
  selected: '',
})
const slots = defineSlots()

const router = useRouter()

const beforePaint = <T extends (...args: any[]) => void>(fn: T) => {
  let num: number
  return (...args: Parameters<T>) => {
    if (num) {
      window.cancelAnimationFrame(num)
    }
    num = window.requestAnimationFrame(fn.bind(fn, ...args))
  }
}

const items = computed(() => {
  return Object.keys(slots).reduce<Tab[]>((prev, key) => {
    const pos = key.lastIndexOf('-tab')
    if (pos !== -1) {
      const title = key.substring(0, pos)
      prev.push(
        {
          title,
          hash: `#${title}`,
        },
      )
    }
    return prev
  }, [])
})

const appView: AppView | undefined = inject<AppView | undefined>('app-view-parent', undefined)
type ProvidedTab = { to: RouteLocationNamedRaw, key: string, label: string }
const tabs: ProvidedTab[] = []
const addTabs = beforePaint(() => {
  if(typeof appView !== 'undefined') {
    appView.setTabs(tabs.map(item => ({
      ...item,
      to: {
        ...item.to,
        params: {
          ...router.currentRoute.value.params,
          ... item.to.params,
        },
      },
      active: item.to.name === props.selected,
    })))
  }
})
provide('x-tabs', {
  add: (item: ProvidedTab) => {
    tabs.push(item)
    addTabs()
  },
})
watch(() => props.selected, () => {
  if(typeof appView !== 'undefined') {
    appView.setTabs(tabs.map(item => ({
      ...item,
      to: {
        ...item.to,
        params: {
          ...router.currentRoute.value.params,
          ...item.to.params,
        },
      },
      active: item.to.name === props.selected,
    })))
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
:deep(.tab-link) {
  /* TODO(jc): override KTab's div styling  */
  padding: 0 !important;
}
:deep(.tab-link) > * {
  transition: inherit;
  border-radius: inherit;
  color: inherit;
  outline: inherit;
  padding: var(--x-space-30) var(--x-space-50);
}
:deep(.tab-link) > *:focus-visible {
  background-color: var(--x-color-background-neutral-weaker);
  box-shadow: var(--x-shadow-focus);
}
</style>
