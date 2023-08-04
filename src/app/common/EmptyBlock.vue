<template>
  <KEmptyState
    data-testid="empty-state"
    cta-is-hidden
    icon="stateGruceo"
    icon-size="96"
  >
    <template #title>
      <slot name="title">
        <p><slot>There is no data to display.</slot></p>
      </slot>
    </template>

    <template
      v-if="$slots.message"
      #message
    >
      <slot name="message" />
    </template>

    <template
      v-if="$slots.cta"
      #cta
    >
      <slot name="cta" />
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KEmptyState } from '@kong/kongponents'
</script>
