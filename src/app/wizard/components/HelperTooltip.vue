<template>
  <KPop
    class="help-icon"
    trigger="click"
    width="100%"
    max-width="300"
    :placement="props.placement"
  >
    <KIcon
      icon="info"
      color="var(--grey-500)"
      size="16"
      hide-title
    />

    <template #content>
      <div>
        <slot />
      </div>
    </template>
  </KPop>
</template>

<script lang="ts" setup>
import { KIcon, KPop, PopPlacements } from '@kong/kongponents'
import { PropType } from 'vue'

const props = defineProps({
  placement: {
    type: String as PropType<PopPlacements>,
    required: false,
    default: undefined,
  },
})
</script>

<style lang="scss" scoped>
.help-icon {
  display: inline-flex;
  align-items: center;
  margin-left: var(--spacing-xs);
}
</style>
