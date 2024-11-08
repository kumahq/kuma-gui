<template>
  <header class="subscription-header">
    <span class="instance-id">
      <img src="@/assets/images/icon-deployed-code.svg?url">

      <template v-if="zoneInstanceId">
        <b>{{ t('http.api.property.zoneInstanceId') }}</b>: {{ zoneInstanceId }}
      </template>

      <template v-else-if="globalInstanceId">
        <b>{{ t('http.api.property.globalInstanceId') }}</b>: {{ globalInstanceId }}
      </template>

      <template v-else-if="controlPlaneInstanceId">
        <b>{{ t('http.api.property.controlPlaneInstanceId') }}</b>: {{ controlPlaneInstanceId }}
      </template>
    </span>

    <span>
      <img src="@/assets/images/icon-connected.svg?url">

      <b>{{ t('common.detail.subscriptions.connect_time') }}</b>:{{ t('common.formats.datetime', { value: Date.parse(props.subscription.connectTime ?? '') }) }}
    </span>

    <span v-if="props.subscription.disconnectTime">
      <img src="@/assets/images/icon-disconnected.svg?url">

      <b>{{ t('common.detail.subscriptions.disconnect_time') }}</b>:{{ t('common.formats.datetime', { value: Date.parse(props.subscription.disconnectTime) }) }}
    </span>

    <span class="responses-sent-acknowledged">
      {{ t('common.detail.subscriptions.responses_sent_acknowledged') }}:

      {{ total.responsesSent }}/{{ total.responsesAcknowledged }}
    </span>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { Subscription } from '../data'
import { useI18n } from '@/app/application'

const { t } = useI18n()

const props = defineProps<{
  subscription: Subscription
}>()

const zoneInstanceId = computed(() => 'zoneInstanceId' in props.subscription ? props.subscription.zoneInstanceId : null)
const globalInstanceId = computed(() => 'globalInstanceId' in props.subscription ? props.subscription.globalInstanceId : null)
const controlPlaneInstanceId = computed(() => 'controlPlaneInstanceId' in props.subscription ? props.subscription.controlPlaneInstanceId : null)
const total = computed(() => {
  const { responsesSent = 0, responsesAcknowledged = 0, responsesRejected = 0 } = props.subscription.status?.total ?? {}

  return {
    responsesSent,
    responsesAcknowledged,
    responsesRejected,
  }
})
</script>

<style lang="scss" scoped>
.subscription-header {
  display: flex;
  gap: $kui-space-80;
  padding-right: $kui-space-40;
  padding-left: $kui-space-40;
  font-weight: $kui-font-weight-medium;
}

.instance-id {
  flex-basis: 50ch;
}

.responses-sent-acknowledged {
  color: $kui-color-text-neutral;
}
</style>
