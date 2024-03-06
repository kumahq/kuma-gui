<template>
  <KEmptyState data-testid="empty-block">
    <template #title>
      <slot name="title">
        {{ t('common.emptyState.title') }}
      </slot>
    </template>

    <template v-if="$slots.default">
      <slot />
    </template>

    <template
      v-if="$slots.action"
      #action
    >
      <slot name="action" />
    </template>
  </KEmptyState>
</template>

<script lang="ts" setup>
import { KEmptyState } from '@kong/kongponents'

import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
