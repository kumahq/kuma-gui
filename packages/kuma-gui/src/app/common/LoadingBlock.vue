<template>
  <KEmptyState data-testid="loading-block">
    <template #icon>
      <ProgressIcon
        class="mb-3"
        :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
      />
    </template>

    <template #title>
      Loading data …
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_WEAK } from '@kong/design-tokens'
import { ProgressIcon } from '@kong/icons'
import { KEmptyState } from '@kong/kongponents'
</script>
