<template>
  <KEmptyState
    class="global-api-status empty-state--wide-content empty-state--compact"
    cta-is-hidden
  >
    <template #title>
      <KIcon
        class="mb-3"
        icon="warning"
        color="var(--black-75)"
        secondary-color="var(--yellow-300)"
        size="64"
      />

      <p>Unable to reach the API</p>
    </template>

    <template #message>
      <p>
        Please double check to make sure it is up and running <span v-if="kumaApi.baseUrl">, and it is reachable at <code>{{ kumaApi.baseUrl }}</code></span>
      </p>
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KEmptyState, KIcon } from '@kong/kongponents'

import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
