<template>
  <template
    v-if="false"
  >
    {{ props.title }}
  </template>
</template>
<script lang="ts" setup>
import { inject, watch, onBeforeUnmount } from 'vue'

import { RouteView } from './RouteView.vue'

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
})

const symbol = Symbol('route-title')
const routeView: RouteView | undefined = inject('route-view-parent')
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
