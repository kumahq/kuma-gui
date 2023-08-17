<template>
  <div class="overview">
    <KEmptyState>
      <template #title>
        <WarningIcon class="mb-3" />

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
import { KButton, KEmptyState } from '@kong/kongponents'

import WarningIcon from '@/app/common/WarningIcon.vue'
</script>
