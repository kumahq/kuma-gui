<template>
  <div
    class="entity-status"
    :class="entityStatusClassNames"
  >
    <span>{{ props.status }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import { Status } from '@/types/index'

const props = defineProps({
  status: {
    type: String as PropType<Status>,
    required: true,
  },
})

const entityStatusClassNames = computed(() => {
  return {
    'is-offline': props.status === 'Offline',
    'is-online': props.status === 'Online',
    'is-degraded': props.status === 'Partially degraded',
    'is-not-available': props.status === 'Not available',
  }
})
</script>

<style lang="scss" scoped>
.entity-status {
  display: flex;
  align-items: center;
  letter-spacing: 0;
  line-height: 20px;
}

.entity-status[class^='is-']::before {
  content: '';
  display: block;
  margin-right: 6px;
  border: 4px solid currentColor;
  border-radius: 50%;
}

.entity-status.is-online {
  color: var(--green-400);
}

.entity-status.is-offline {
  color: var(--red-600);
}

.entity-status.is-degraded {
  color: var(--custom-orange);
}

.entity-status.is-not-available {
  color: var(--grey-500);
}
</style>
