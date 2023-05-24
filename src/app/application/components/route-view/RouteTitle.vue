<template>
  <template
    v-if="false"
  >
    {{ props.title }}
  </template>
</template>
<script lang="ts" setup>
import { inject, PropType, watch, onUnmounted } from 'vue'

import { RouteView } from './RouteView.vue'

const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
})

const symbol = Symbol('route-title')
const routeView: RouteView | undefined = inject('route-view-parent')
if (typeof routeView !== 'undefined') {
  watch(() => props.title, (title: string) => {
    if (title.length > 0) {
      routeView.addTitle(title, symbol)
    }
  }, { immediate: true })
  onUnmounted(() => {
    routeView.removeTitle(symbol)
  })
}

</script>
