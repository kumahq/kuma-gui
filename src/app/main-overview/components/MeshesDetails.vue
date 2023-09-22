<template>
  <AppCollection
    class="mesh-preview-collection"
    data-testid="mesh-preview-collection"
    :headers="[
      { label: t('main-overview.detail.meshes.table.name'), key: 'name'},
      { label: t('main-overview.detail.meshes.table.services'), key: 'services'},
      { label: t('main-overview.detail.meshes.table.data_plane_proxies'), key: 'dataPlaneProxies'},
    ]"
    :items="tableData"
    :total="tableData.length"
    :empty-state-message="t('common.emptyState.message', { type: 'Meshes' })"
    :empty-state-cta-to="t('meshes.href.docs')"
    :empty-state-cta-text="t('common.documentation')"
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
  </AppCollection>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'

import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
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
    services: services.internal ?? 0,
    dataPlaneProxies: `${dataplanesByType.standard.online ?? 0}/${dataplanesByType.standard.total ?? 0}`,
  }
}))
</script>
