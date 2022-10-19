<template>
  <KEmptyState
    cta-is-hidden
    data-testid="loading-block"
  >
    <template #title>
      <div class="card-icon mb-3">
        <KIcon
          icon="spinner"
          color="rgba(0, 0, 0, 0.1)"
          size="42"
        />
      </div>

      <slot>
        <p>Loading data …</p>
      </slot>
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KEmptyState, KIcon } from '@kong/kongponents'
</script>
