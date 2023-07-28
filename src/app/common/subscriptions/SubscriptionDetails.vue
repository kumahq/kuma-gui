<template>
  <div>
    <div v-if="details.globalInstanceId || details.controlPlaneInstanceId || details.connectTime || details.disconnectTime">
      <h5 class="overview-tertiary-title">
        General Information:
      </h5>

      <DefinitionList>
        <DefinitionListItem
          v-if="details.globalInstanceId"
          :term="t('http.api.property.globalInstanceId')"
        >
          {{ details.globalInstanceId }}
        </DefinitionListItem>

        <DefinitionListItem
          v-if="details.controlPlaneInstanceId"
          :term="t('http.api.property.controlPlaneInstanceId')"
        >
          {{ details.controlPlaneInstanceId }}
        </DefinitionListItem>

        <DefinitionListItem
          v-if="details.connectTime"
          :term="t('http.api.property.connectTime')"
        >
          {{ formatIsoDate(details.connectTime) }}
        </DefinitionListItem>

        <DefinitionListItem
          v-if="details.disconnectTime"
          :term="t('http.api.property.disconnectTime')"
        >
          {{ formatIsoDate(details.disconnectTime) }}
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
            {{ t(`http.api.property.${label}`) }}:
          </h6>

          <DefinitionList>
            <DefinitionListItem
              v-for="(value, property) in item"
              :key="property"
              :term="t(`http.api.property.${property}`)"
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
import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

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
  font-weight: var(--font-weight-semi-bold);
  color: var(--grey-500);
  margin: var(--spacing-xs) 0;
}
</style>
