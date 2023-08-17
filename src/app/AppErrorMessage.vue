<template>
  <KEmptyState
    class="global-api-status empty-state--wide-content empty-state--compact"
    cta-is-hidden
  >
    <template #title>
      <WarningIcon class="mb-3" />

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
import { KEmptyState } from '@kong/kongponents'

import WarningIcon from '@/app/common/WarningIcon.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
