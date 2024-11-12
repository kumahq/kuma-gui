<template>
  <DefinitionCard>
    <template
      v-if="$slots.icon"
      #icon
    >
      <slot name="icon" />
    </template>

    <template #title>
      <slot name="title" />
    </template>

    <template #body>
      <div class="status">
        <span
          v-if="props.online !== null"
          class="status-online"
          :class="{ [`status-online--${statusAppearance}`]: statusAppearance !== null }"
        >{{ props.online }}</span><span
          v-if="props.online !== null"
          class="status-separator"
        >/</span><span class="status-total">{{ props.total }}</span>
      </div>
    </template>
  </DefinitionCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import DefinitionCard from './DefinitionCard.vue'

const props = withDefaults(defineProps<{
  total: number
  online?: number | null
}>(), {
  online: null,
})

const statusAppearance = computed(() => {
  if (props.online !== null) {
    const ratio = props.online / props.total

    if (ratio <= 0.5) {
      return 'danger'
    } else if (ratio < 1) {
      return 'warning'
    }
  }

  return null
})
</script>

<style lang="scss" scoped>
.status-separator,
.status-separator + .status-total {
  color: $kui-color-text-neutral;
}

.status-online {
  color: var(--status-color, currentColor);
}

.status-online--warning {
  --status-color: #{$kui-color-text-warning};
}

.status-online--danger {
  --status-color: #{$kui-color-text-danger};
}
</style>
