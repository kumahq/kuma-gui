<template>
  <KEmptyState
    cta-is-hidden
    data-testid="loading-block"
  >
    <template #title>
      <KIcon
        class="mb-3"
        icon="spinner"
        color="rgba(0, 0, 0, 0.1)"
        size="42"
      />

      <slot>
        <p>Loading data …</p>
      </slot>
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KEmptyState, KIcon } from '@kong/kongponents'
</script>
