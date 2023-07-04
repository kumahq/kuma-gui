<template>
  <KEmptyState>
    <template #title>
      <KIcon
        class="mb-3"
        icon="dangerCircleOutline"
        size="42"
      />

      <p>{{ t('common.product.name') }} is running in Standalone mode.</p>
    </template>

    <template #message>
      <p>
        To access this page, you must be running in <strong>Multi-Zone</strong> mode.
      </p>
    </template>

    <template #cta>
      <KButton
        :to="docLink('/documentation/deployments/')"
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

import { useI18n } from '@/utilities'
import { docLink } from "@/utilities/docLink";

const { t } = useI18n()
</script>
