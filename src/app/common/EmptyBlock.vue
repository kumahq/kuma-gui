<template>
  <KEmptyState
    data-testid="empty-state"
    cta-is-hidden
    icon="stateGruceo"
    icon-size="96"
  >
    <template #title>
      <slot name="title">
        <p><slot>{{ t('common.emptyState.title') }}</slot></p>
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

import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
