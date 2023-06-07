<template>
  <span
    class="status"
    :class="{
      [`status--${props.status}`]: true,
    }"
    data-testid="status-badge"
  >
    <span>
      {{ i18n.t(`http.api.value.${props.status}`) }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import { StatusKeyword } from '@/types/index.d'
import { useI18n } from '@/utilities'

const i18n = useI18n()

const props = defineProps({
  status: {
    type: String as PropType<StatusKeyword>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.status {
  white-space: nowrap;
}

.status::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  margin-right: var(--spacing-xs);
  border: 4px solid currentColor;
  border-radius: 50%;
}

.status--not_available {
  color: var(--gray-400);
}

.status--online {
  color: var(--green-500);
}

.status--partially_degraded {
  color: var(--yellow-500);
}

.status--offline {
  color:  var(--red-600);
}
</style>
