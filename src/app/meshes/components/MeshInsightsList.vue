<template>
  <AppCollection
    :headers="[
      { label: t('meshes.components.mesh-insights-list.name'), key: 'name'},
      { label: t('meshes.components.mesh-insights-list.services'), key: 'services'},
      { label: t('meshes.components.mesh-insights-list.dataplanes'), key: 'dataplanes'},
    ]"
    :items="props.items"
    :total="props.items?.length"
    :empty-state-message="t('common.emptyState.message', { type: t('meshes.common.type', {count: 2}) })"
    :empty-state-cta-to="t('meshes.href.docs')"
    :empty-state-cta-text="t('common.documentation')"
  >
    <template #name="{ row: item }">
      <RouterLink
        :to="{
          name: 'mesh-detail-view',
          params: {
            mesh: item.name,
          },
        }"
      >
        {{ item.name }}
      </RouterLink>
    </template>
    <template #services="{ row: item }">
      {{ item.services.internal ?? '0' }}
    </template>
    <template #dataplanes="{ row: item }">
      {{ item.dataplanesByType.standard.online ?? '0' }} / {{ item.dataplanesByType.standard.total ?? '0' }}
    </template>
  </AppCollection>
</template>

<script lang="ts" setup>
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import type { MeshInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  items?: MeshInsight[]
}>()
</script>
