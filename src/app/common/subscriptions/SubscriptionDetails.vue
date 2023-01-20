<template>
  <div>
    <div v-if="details.globalInstanceId || details.connectTime || details.disconnectTime">
      <h5 class="overview-tertiary-title">
        General Information:
      </h5>

      <ul>
        <li v-if="details.globalInstanceId">
          <strong>Global Instance ID:</strong>&nbsp;
          <span class="mono">{{ details.globalInstanceId }}</span>
        </li>

        <li v-if="details.controlPlaneInstanceId">
          <strong>Control Plane Instance ID:</strong>&nbsp;
          <span class="mono">{{ details.controlPlaneInstanceId }}</span>
        </li>

        <li v-if="details.connectTime">
          <strong>Last Connected:</strong>&nbsp;
          {{ humanReadableDate(details.connectTime) }}
        </li>

        <li v-if="details.disconnectTime">
          <strong>Last Disconnected:</strong>&nbsp;
          {{ humanReadableDate(details.disconnectTime) }}
        </li>
      </ul>
    </div>

    <div v-if="detailsIterator">
      <ul class="overview-stat-grid">
        <li
          v-for="(item, label) in detailsIterator"
          :key="label"
        >
          <h6 class="overview-tertiary-title">
            {{ camelCaseToWords(label) }}:
          </h6>

          <ul>
            <li
              v-for="(k, v) in item"
              :key="v"
            >
              <strong>{{ camelCaseToWords(v) }}:</strong>&nbsp;
              <span class="mono">{{ formatError(formatValue(k)) }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <KAlert
      v-else
      appearance="info"
      class="mt-4"
    >
      <template #alertIcon>
        <KIcon icon="portal" />
      </template>

      <template #alertMessage>
        There are no subscription statistics for <strong>{{ details.id }}</strong>
      </template>
    </KAlert>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { KAlert, KIcon } from '@kong/kongponents'

import { humanReadableDate, camelCaseToWords } from '@/utilities/helpers'

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },

  isDiscoverySubscription: {
    type: Boolean,
    default: false,
  },
})

const detailsIterator = computed<Record<string, Record<string, any>>>(() => {
  if (props.isDiscoverySubscription) {
    const { lastUpdateTime, total, ...restDetails } = props.details.status

    return restDetails
  }

  return props.details.status?.stat
})

function formatValue(value: string): string {
  return value ? parseInt(value, 10).toLocaleString('en').toString() : '0'
}

function formatError(value: string): string {
  if (value === '--') {
    return 'error calculating'
  }

  return value
}
</script>

<style lang="scss" scoped>
.overview-tertiary-title {
  font-size: var(--type-sm);
  font-weight: bold;
  text-transform: uppercase;
  color: var(--grey-500);
  margin: var(--spacing-xs) 0;
}

.overview-stat-grid {
  display: grid;
  margin: var(--spacing-md) 0 0 0;

  @media (min-width: 1140px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px 20px;
  }
}
</style>
