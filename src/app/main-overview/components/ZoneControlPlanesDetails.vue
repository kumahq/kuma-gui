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

import StatusBadge from '@/app/common/StatusBadge.vue'
import type { ZoneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const { t } = useI18n()

const props = defineProps({
  zoneOverviews: {
    type: Array as PropType<ZoneOverview[]>,
    required: true,
  },
})

const tableData = computed(() => props.zoneOverviews.map((zoneOverview) => {
  const { name } = zoneOverview

  const status = getItemStatusFromInsight(zoneOverview.zoneInsight)

  return {
    name,
    status,
  }
}))
</script>
