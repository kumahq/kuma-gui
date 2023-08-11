<template>
  <div class="stack">
    <KAlert
      v-if="statuses.length === 0"
      appearance="info"
    >
      <template #alertIcon>
        <KIcon icon="portal" />
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
            {{ t('http.api.property.responsesSent') }}
          </div>

          <div class="header">
            {{ t('http.api.property.responsesAcknowledged') }}
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
            {{ row.responsesSent }}
          </div>

          <div>
            {{ row.responsesAcknowledged }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { KAlert, KIcon } from '@kong/kongponents'
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
  responsesSent: number
  responsesAcknowledged: number
  responsesRejected: number
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
      responsesSent: parseInt(responsesSent),
      responsesAcknowledged: parseInt(responsesAcknowledged),
      responsesRejected: parseInt(responsesRejected),
    }
  })
})
</script>

<style lang="scss" scoped>
.overview-tertiary-title {
  font-size: var(--type-sm);
  font-weight: var(--font-weight-semi-bold);
  color: var(--grey-500);
  margin: var(--spacing-xs) 0;
}

.row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: var(--spacing-xs);
}

.header,
.type {
  font-weight: var(--font-weight-semi-bold);
}

.type {
  color: var(--grey-600);
}
</style>
