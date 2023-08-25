<template>
  <KTable
    :headers="[
      { label: t('main-overview.detail.zone_control_planes.table.name'), key: 'name'},
      { label: t('main-overview.detail.zone_control_planes.table.status'), key: 'status'},
    ]"
    :fetcher="() => ({ data: tableData })"
    disable-sorting
    hide-pagination-when-optional
  >
    <template
      v-if="props.zoneOverviews.length === 0"
      #empty-state
    >
      <EmptyBlock>
        {{ t('main-overview.detail.zone_control_planes.empty_state.title') }}

        <template
          v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled'"
          #message
        >
          {{ t('main-overview.detail.zone_control_planes.empty_state.message') }}
        </template>

        <template
          v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled'"
          #cta
        >
          <KButton
            appearance="primary"
            icon="plus"
            :to="{ name: 'zone-create-view' }"
          >
            {{ t('zones.index.create') }}
          </KButton>
        </template>
      </EmptyBlock>
    </template>

    <template #name="{ rowValue }">
      <RouterLink
        :to="{
          name: 'zone-cp-detail-view',
          params: {
            zone: rowValue,
          },
        }"
      >
        {{ rowValue }}
      </RouterLink>
    </template>

    <template #status="{ rowValue }">
      <StatusBadge
        v-if="rowValue"
        :status="rowValue"
      />

      <template v-else>
        {{ t('common.collection.none') }}
      </template>
    </template>
  </KTable>
</template>

<script lang="ts" setup>
import { KTable } from '@kong/kongponents'
import { PropType, computed } from 'vue'

import EmptyBlock from '@/app/common/EmptyBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { getZoneControlPlaneStatus } from '@/app/zones/getZoneControlPlaneStatus'
import type { ZoneOverview } from '@/types/index.d'
import { useEnv, useI18n } from '@/utilities'

const { t } = useI18n()
const env = useEnv()

const props = defineProps({
  zoneOverviews: {
    type: Array as PropType<ZoneOverview[]>,
    required: true,
  },
})

const tableData = computed(() => props.zoneOverviews.map((zoneOverview) => {
  const { name } = zoneOverview

  const status = getZoneControlPlaneStatus(zoneOverview)

  return {
    name,
    status,
  }
}))
</script>
