<template>
  <AppCollection
    class="zone-cp-preview-collection"
    data-testid="zone-cp-preview-collection"
    :headers="[
      { label: t('main-overview.detail.zone_control_planes.table.name'), key: 'name'},
      { label: t('main-overview.detail.zone_control_planes.table.status'), key: 'status'},
    ]"
    :items="tableData"
    :total="tableData.length"
    :empty-state-title="t('zone-cps.empty_state.title')"
    :empty-state-message="env('KUMA_ZONE_CREATION_FLOW') === 'enabled' ? t('zone-cps.empty_state.message') : t('common.emptyState.message', { type: 'Zones' })"
    :empty-state-cta-to="env('KUMA_ZONE_CREATION_FLOW') === 'enabled' ? { name: 'zone-create-view' } : undefined"
    :empty-state-cta-text="t('zones.index.create')"
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
  </AppCollection>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'

import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
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
