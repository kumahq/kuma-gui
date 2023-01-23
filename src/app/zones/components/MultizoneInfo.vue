<template>
  <KEmptyState>
    <template #title>
      <KIcon
        class="mb-3"
        icon="dangerCircleOutline"
        size="42"
      />

      <p>{{ PRODUCT_NAME }} is running in Standalone mode.</p>
    </template>

    <template #message>
      <p>
        To access this page, you must be running in <strong>Multi-Zone</strong> mode.
      </p>
    </template>

    <template #cta>
      <KButton
        :to="`${env('KUMA_DOCS_URL')}/documentation/deployments/?${env('KUMA_UTM_QUERY_PARAMS')}`"
        target="_blank"
        appearance="primary"
      >
        Learn More
      </KButton>
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KButton, KEmptyState, KIcon } from '@kong/kongponents'

import { PRODUCT_NAME } from '@/constants'
import { useEnv } from '@/utilities'

const env = useEnv()
</script>
