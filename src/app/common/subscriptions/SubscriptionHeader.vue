<template>
  <header class="subscription-header">
    <span class="status--is-connected">{{ t('zone-cps.detail.connect_time') }}: {{ formatIsoDate(props.details.connectTime) }}</span>

    <span
      v-if="props.details.disconnectTime"
      class="ml-4 status--is-disconnected"
    >{{ t('zone-cps.detail.disconnect_time') }}: {{ formatIsoDate(props.details.disconnectTime) }}</span>
  </header>
</template>

<script lang="ts" setup>
import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.subscription-header {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: var(--font-weight-medium);
}

.status--is-connected {
  color: var(--green-500);
}

.status--is-disconnected {
  color: var(--red-500);
}

</style>
