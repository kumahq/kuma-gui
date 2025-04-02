<template>
  <KEmptyState
    v-if="props.variant === 'legacy'"
    data-testid="loading-block"
  >
    <template
      #icon
    >
      <XIcon
        class="mb-3"
        name="progress"
        :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
      />
    </template>

    <template
      #title
    >
      Loading data …
    </template>
  </KEmptyState>
  <XIcon
    v-else-if="props.variant === 'spinner'"
    name="progress"
    data-testid="spinner"
    :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
  />
  <KSkeleton
    v-else-if="props.variant === 'list'"
    data-testid="list-skeleton"
    type="table"
  />
  <KSkeletonBox
    v-else-if="props.variant === 'line'"
    data-testid="line-skeleton"
    width="10"
  />
</template>
<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_WEAK } from '@kong/design-tokens'
import { KEmptyState } from '@kong/kongponents'
const props = withDefaults(defineProps<{
  variant?: 'list' | 'line' | 'spinner' | 'legacy'
}>(), {
  variant: 'legacy',
})
</script>
