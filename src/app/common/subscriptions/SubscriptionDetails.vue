<template>
  <div>
    <div v-if="details.globalInstanceId || details.controlPlaneInstanceId || details.connectTime || details.disconnectTime">
      <h5 class="overview-tertiary-title">
        General Information:
      </h5>

      <DefinitionList>
        <DefinitionListItem
          v-if="details.globalInstanceId"
          term="Global instance ID"
        >
          {{ details.globalInstanceId }}
        </DefinitionListItem>

        <DefinitionListItem
          v-if="details.controlPlaneInstanceId"
          term="CP instance ID"
        >
          {{ details.controlPlaneInstanceId }}
        </DefinitionListItem>

        <DefinitionListItem
          v-if="details.connectTime"
          term="Last connected"
        >
          {{ humanReadableDate(details.connectTime) }}
        </DefinitionListItem>

        <DefinitionListItem
          v-if="details.disconnectTime"
          term="Last disconnected"
        >
          {{ humanReadableDate(details.disconnectTime) }}
        </DefinitionListItem>
      </DefinitionList>
    </div>

    <div
      v-if="detailsIterator"
      class="columns mt-4"
      style="--columns: 4"
    >
      <template
        v-for="(item, label) in detailsIterator"
        :key="label"
      >
        <div v-if="Object.keys(item).length > 0">
          <h6 class="overview-tertiary-title">
            {{ label }}:
          </h6>

          <DefinitionList>
            <DefinitionListItem
              v-for="(value, property) in item"
              :key="property"
              :term="property"
            >
              {{ formatError(formatValue(value)) }}
            </DefinitionListItem>
          </DefinitionList>
        </div>
      </template>
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
import { KAlert, KIcon } from '@kong/kongponents'
import { computed } from 'vue'

import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import { humanReadableDate } from '@/utilities/helpers'

const map: Record<string, string> = {
  responsesSent: 'Responses sent',
  responsesAcknowledged: 'Responses acknowledged',
  responsesRejected: 'Responses rejected',
}

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
  let details
  if (props.isDiscoverySubscription) {
    const { lastUpdateTime, total, ...restDetails } = props.details.status

    details = restDetails
  }

  if (props.details.status?.stat) {
    details = props.details.status?.stat
  }

  for (const detailProperty in details) {
    const detail: any = details[detailProperty]

    for (const prop in detail) {
      if (prop in map) {
        detail[map[prop]] = detail[prop]
        delete detail[prop]
      }
    }
  }

  return details
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
  font-weight: 600;
  color: var(--grey-500);
  margin: var(--spacing-xs) 0;
}
</style>
