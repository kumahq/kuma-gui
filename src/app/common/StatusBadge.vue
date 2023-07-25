<template>
  <KBadge
    class="status"
    :appearance="BADGE_APPEARANCE[props.status]"
    data-testid="status-badge"
  >
    {{ i18n.t(`http.api.value.${props.status}`) }}
  </KBadge>
</template>

<script lang="ts" setup>
import { BadgeAppearance, KBadge } from '@kong/kongponents'
import { PropType } from 'vue'

import { StatusKeyword } from '@/types/index.d'
import { useI18n } from '@/utilities'

const i18n = useI18n()

const BADGE_APPEARANCE: Record<StatusKeyword, BadgeAppearance> = {
  online: 'success',
  offline: 'danger',
  partially_degraded: 'warning',
  not_available: 'neutral',
}

const props = defineProps({
  status: {
    type: String as PropType<StatusKeyword>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.status {
  align-items: center;
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
}

.status::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  margin-right: var(--spacing-xxs);
  border: 4px solid currentColor;
  border-radius: 50%;
}
</style>
