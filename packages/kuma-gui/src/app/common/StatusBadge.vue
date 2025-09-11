<template>
  <component :is="props.status === 'not_available' ? XTooltip : XAnonymous">
    <XBadge
      class="status-badge"
      :appearance="BADGE_APPEARANCE[props.status]"
      max-width="auto"
      data-testid="status-badge"
    >
      {{ t(`http.api.value.${props.status}`) }}
    </XBadge>
    <template
      v-if="props.status === 'not_available'"
      #content
    >
      {{ t('components.status-badge.tooltip.not_available') }}
    </template>
  </component>
</template>

<script lang="ts" setup>

import { XAnonymous, XTooltip } from '@kumahq/x'

import { useI18n } from '@/app/application'
import type { StatusKeyword } from '@/types/index.d'
import type { BadgeAppearance } from '@kong/kongponents'


const { t } = useI18n()

const BADGE_APPEARANCE: Record<StatusKeyword | 'disabled', BadgeAppearance> = {
  online: 'success',
  offline: 'danger',
  partially_degraded: 'warning',
  not_available: 'neutral',
  disabled: 'neutral',
}

const props = defineProps<{
  status: StatusKeyword | 'disabled'
}>()
</script>

<style lang="scss" scoped>
.status {
  align-items: center;
  white-space: nowrap;
  font-weight: $kui-font-weight-medium;
}

.status::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  margin-right: $kui-space-20;
  border: 4px solid currentColor;
  border-radius: 50%;
}
</style>
