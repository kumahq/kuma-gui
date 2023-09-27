<template>
  <div class="stack">
    <KAlert
      v-if="statuses.length === 0"
      appearance="info"
    >
      <template #alertIcon>
        <PortalIcon />
      </template>

      <template #alertMessage>
        {{ t('common.detail.subscriptions.no_stats', { id: props.subscription.id }) }}
      </template>
    </KAlert>

    <template v-else>
      <div>
        <div class="row">
          <div class="header">
            {{ t('common.detail.subscriptions.type') }}
          </div>

          <div class="header">
            {{ t('common.detail.subscriptions.responses_sent_acknowledged') }}
          </div>
        </div>

        <div
          v-for="(row, index) in statuses"
          :key="index"
          class="row"
          :data-testid="`subscription-status-${row.type}`"
        >
          <div class="type">
            {{ t(`http.api.property.${row.type}`) }}
          </div>

          <div>
            {{ row.responsesSent }}/{{ row.responsesAcknowledged }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PortalIcon } from '@kong/icons'
import { KAlert } from '@kong/kongponents'
import { PropType, computed } from 'vue'

import type { DiscoveryServiceStats, DiscoverySubscription, KDSSubscription } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  subscription: {
    type: Object as PropType<KDSSubscription | DiscoverySubscription>,
    required: true,
  },

  isDiscoverySubscription: {
    type: Boolean,
    default: false,
  },
})

type StatusRow = {
  type: string
  responsesSent: string
  responsesAcknowledged: string
  responsesRejected: string
}

const statuses = computed<StatusRow[]>(() => {
  let status: Record<string, DiscoveryServiceStats>

  if ('controlPlaneInstanceId' in props.subscription) {
    const { lastUpdateTime, total, ...discoverySubscriptionStatus } = props.subscription.status
    status = discoverySubscriptionStatus
  } else {
    status = props.subscription.status?.stat ?? {}
  }

  if (!status) {
    return []
  }

  return Object.entries(status).map(([type, stat]) => {
    const { responsesSent = '0', responsesAcknowledged = '0', responsesRejected = '0' } = stat

    return {
      type,
      responsesSent,
      responsesAcknowledged,
      responsesRejected,
    }
  })
})
</script>

<style lang="scss" scoped>
.row {
  display: grid;
  grid-template-columns: 30ch 1fr;
  padding: $kui-space-40;
}

.header,
.type {
  font-weight: $kui-font-weight-semibold;
}

.type {
  color: $kui-color-text-neutral-stronger;
}
</style>
