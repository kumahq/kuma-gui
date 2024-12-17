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
        <template v-if="typeof props.online !== 'undefined'">
          <template
            v-for="ratio in [props.online / props.total]"
            :key="typeof ratio"
          >
            <span
              class="status-online"
              :class="{ [`status-online--${ratio <= 0.5 ? 'danger' : 'warning'}`]: ratio < 1 }"
            >{{ props.online }}</span><span class="status-separator">/</span>
          </template>
        </template><span class="status-total">{{ props.total }}</span>
      </div>
    </template>
  </DefinitionCard>
</template>

<script lang="ts" setup>
import DefinitionCard from './DefinitionCard.vue'

const props = withDefaults(defineProps<{
  total: number
  online?: number
}>(), {
  online: undefined,
})
</script>

<style lang="scss" scoped>
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
