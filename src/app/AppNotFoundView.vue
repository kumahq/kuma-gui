<template>
  <div class="overview">
    <KEmptyState>
      <template #title>
        <KIcon
          class="mb-3"
          icon="warning"
          color="var(--black-75)"
          secondary-color="var(--yellow-300)"
          size="64"
        />

        <p>Page Not Found</p>
      </template>

      <template #message>
        The page or entity you were looking for does not exist.
      </template>

      <template #cta>
        <KButton
          appearance="primary"
          :to="{ name: 'home' }"
        >
          Go Home
        </KButton>
      </template>
    </KEmptyState>
  </div>
</template>

<script lang="ts" setup>
import { KButton, KEmptyState, KIcon } from '@kong/kongponents'
</script>
