<template>
  <header class="subscription-header">
    <span>
      <img src="@/assets/images/icon-deployed-code.svg?url">

      <template v-if="globalInstanceId">
        <b>{{ t('http.api.property.globalInstanceId') }}</b>: {{ globalInstanceId }}
      </template>

      <template v-else-if="controlPlaneInstanceId">
        <b>{{ t('http.api.property.controlPlaneInstanceId') }}</b>: {{ controlPlaneInstanceId }}
      </template>
    </span>

    <span>
      <img src="@/assets/images/icon-connected.svg?url">

      <b>{{ t('common.detail.subscriptions.connect_time') }}</b>: {{ connectTime }}
    </span>

    <span>
      <template v-if="disconnectTime">
        <img src="@/assets/images/icon-disconnected.svg?url">

        <b>{{ t('common.detail.subscriptions.disconnect_time') }}</b>: {{ disconnectTime }}
      </template>
    </span>
  </header>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'

import type { DiscoverySubscription, KDSSubscription } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

const props = defineProps({
  subscription: {
    type: Object as PropType<KDSSubscription | DiscoverySubscription>,
    required: true,
  },
})

const globalInstanceId = computed(() => 'globalInstanceId' in props.subscription ? props.subscription.globalInstanceId : null)
const controlPlaneInstanceId = computed(() => 'controlPlaneInstanceId' in props.subscription ? props.subscription.controlPlaneInstanceId : null)
const connectTime = computed(() => props.subscription.connectTime ? formatIsoDate(props.subscription.connectTime) : null)
const disconnectTime = computed(() => props.subscription.disconnectTime ? formatIsoDate(props.subscription.disconnectTime) : null)
</script>

<style lang="scss" scoped>
.subscription-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-right: var(--spacing-xs);
  padding-left: var(--spacing-xs);
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: var(--font-weight-medium);
}
</style>
