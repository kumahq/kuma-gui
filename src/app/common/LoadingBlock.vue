<template>
  <KEmptyState
    cta-is-hidden
    data-testid="loading-block"
  >
    <template #title>
      <ProgressIcon
        class="mb-3"
        :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
      />

      <slot>
        <p>Loading data …</p>
      </slot>
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_WEAK } from '@kong/design-tokens'
import { ProgressIcon } from '@kong/icons'
import { KEmptyState } from '@kong/kongponents'
</script>
