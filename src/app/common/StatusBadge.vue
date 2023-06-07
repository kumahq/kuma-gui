<template>
  <span
    class="status"
    :class="{
      'status--with-title': !props.shouldHideTitle,
      [`status--${statusObject.appearance}`]: true,
    }"
    data-testid="status-badge"
  >
    <span :class="{ 'visually-hidden': props.shouldHideTitle }">
      {{ statusObject.title }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import { StatusKeyword } from '@/types/index.d'
import { useI18n } from '@/utilities'

const i18n = useI18n()

const STATUS: Record<StatusKeyword, string> = {
  not_available: 'not-available',
  partially_degraded: 'warning',
  offline: 'danger',
  online: 'success',
}

const props = defineProps({
  status: {
    type: String as PropType<StatusKeyword>,
    required: true,
  },

  shouldHideTitle: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const statusObject = computed(() => ({
  title: i18n.t(`http.api.value.${props.status}`),
  appearance: STATUS[props.status],
}))
</script>

<style lang="scss" scoped>
.status {
  white-space: nowrap;
}

.status::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  border: 4px solid currentColor;
  border-radius: 50%;
}

.status--with-title::before {
  margin-right: var(--spacing-xs);
}

.status--not-available {
  color: var(--gray-400);
}

.status--success {
  color: var(--green-500);
}

.status--warning {
  color: var(--yellow-500);
}

.status--danger {
  color:  var(--red-600);
}
</style>
