<template>
  <KTable
    :headers="[
      { label: t('main-overview.detail.meshes.table.name'), key: 'name'},
      { label: t('main-overview.detail.meshes.table.services'), key: 'services'},
      { label: t('main-overview.detail.meshes.table.data_plane_proxies'), key: 'dataPlaneProxies'},
    ]"
    :fetcher="() => ({ data: tableData })"
    disable-sorting
    hide-pagination-when-optional
  >
    <template #name="{ rowValue }">
      <RouterLink
        :to="{
          name: 'mesh-detail-view',
          params: {
            mesh: rowValue,
          },
        }"
      >
        {{ rowValue }}
      </RouterLink>
    </template>
  </KTable>
</template>

<script lang="ts" setup>
import { KTable } from '@kong/kongponents'
import { PropType, computed } from 'vue'

import type { MeshInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  meshInsights: {
    type: Array as PropType<MeshInsight[]>,
    required: true,
  },
})

const tableData = computed(() => props.meshInsights.map((meshInsight) => {
  const { name, services, dataplanesByType } = meshInsight

  return {
    name,
    services: services.total ?? 0,
    dataPlaneProxies: dataplanesByType.standard.total ?? 0,
  }
}))
</script>
