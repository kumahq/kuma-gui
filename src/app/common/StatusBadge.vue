<template>
  <span
    class="status"
    :class="{
      'status--with-title': !props.shouldHideTitle,
      [appearanceClassName]: true,
    }"
    data-testid="status-badge"
  >
    <span :class="{ 'visually-hidden': props.shouldHideTitle }">
      {{ props.status.title.toLowerCase() }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import { Status } from '@/types/index'

const props = defineProps({
  status: {
    type: Object as PropType<Status>,
    required: true,
  },

  shouldHideTitle: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const appearanceClassName = computed(() => `status--${props.status.appearance}`)
</script>

<style lang="scss" scoped>
.status::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  border: 4px solid currentColor;
  border-radius: 50%;
}

.status--with-title::before {
  margin-right: var(--spacing-xs);
}

.status--success {
  color: var(--green-500);
}

.status--warning {
  color: var(--yellow-500);
}

.status--danger {
  color:  var(--red-600);
}
</style>
