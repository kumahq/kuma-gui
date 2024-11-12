<template>
  <template
    v-if="props.render"
  >
    {{ props.title }}
  </template>
</template>
<script lang="ts" setup>
import { inject, watch, onBeforeUnmount } from 'vue'

import { ROUTE_VIEW_PARENT } from '.'
import type { RouteView } from './RouteView.vue'

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
  render: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const symbol = Symbol('route-title')
// find the top-most RouteView so we can use it to set the title if we can't
// find the top-most, it means we are the top-most RouteView
const routeView: RouteView | undefined = inject(ROUTE_VIEW_PARENT)
if (typeof routeView !== 'undefined') {
  watch(() => props.title, (title) => {
    if (title.length > 0) {
      routeView.addTitle(title, symbol)
    }
  }, { immediate: true })
  onBeforeUnmount(() => {
    routeView.removeTitle(symbol)
  })
}

</script>
