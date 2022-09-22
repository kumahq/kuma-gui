<template>
  <KEmptyState cta-is-hidden>
    <template #title>
      <div class="card-icon mb-3">
        <KIcon
          class="kong-icon--centered"
          icon="warning"
          color="var(--black-75)"
          secondary-color="var(--yellow-300)"
          size="42"
        />
      </div>

      <p>There is no data to display.</p>
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KEmptyState, KIcon } from '@kong/kongponents'
</script>
