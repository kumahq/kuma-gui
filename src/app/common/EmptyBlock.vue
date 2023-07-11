<template>
  <KEmptyState
    data-testid="empty-state"
    cta-is-hidden
  >
    <template #title>
      <slot name="title">
        <KIcon
          class="mb-3"
          icon="warning"
          color="var(--black-500)"
          secondary-color="var(--yellow-300)"
          size="42"
        />

        <slot>
          <p>There is no data to display.</p>
        </slot>
      </slot>
    </template>

    <template
      v-if="$slots.message"
      #message
    >
      <slot name="message" />
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KEmptyState, KIcon } from '@kong/kongponents'
</script>
