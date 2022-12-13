<template>
  <span
    class="status"
    :class="{
      'status--with-title': !props.shouldHideTitle,
      [`status--${statusObject.appearance}`]: true,
    }"
    data-testid="status-badge"
  >
    <span :class="{ 'visually-hidden': props.shouldHideTitle }">
      {{ statusObject.title }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import { StatusKeyword } from '@/types/index.d'

const STATUS: Record<StatusKeyword, { title: string, appearance: string }> = {
  not_available: {
    title: 'not available',
    appearance: 'warning',
  },
  partially_degraded: {
    title: 'partially degraded',
    appearance: 'warning',
  },
  offline: {
    title: 'offline',
    appearance: 'danger',
  },
  online: {
    title: 'online',
    appearance: 'success',
  },
}

const props = defineProps({
  status: {
    type: String as PropType<StatusKeyword>,
    required: true,
  },

  shouldHideTitle: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const statusObject = computed(() => STATUS[props.status])
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
