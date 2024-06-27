<template>
  <div>
    <DataCollection
      :items="props.items ?? [undefined]"
      type="meshes"
    >
      <AppCollection
        :headers="[
          { label: t('meshes.components.mesh-insights-list.name'), key: 'name'},
          { label: t('meshes.components.mesh-insights-list.services'), key: 'services'},
          { label: t('meshes.components.mesh-insights-list.dataplanes'), key: 'dataplanes'},
        ]"
        :items="props.items"
        :total="props.items?.length"
      >
        <template
          #name="{ row: item }"
        >
          <XAction
            :to="{
              name: 'mesh-detail-view',
              params: {
                mesh: item.name,
              },
            }"
          >
            {{ item.name }}
          </XAction>
        </template>

        <template
          #services="{ row: item }"
        >
          {{ item.services.internal }}
        </template>

        <template
          #dataplanes="{ row: item }"
        >
          {{ item.dataplanesByType.standard.online }} / {{ item.dataplanesByType.standard.total }}
        </template>
      </AppCollection>
    </DataCollection>
  </div>
</template>

<script lang="ts" setup>
import type { MeshInsight } from '../data'
import { useI18n } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'

const { t } = useI18n()

const props = defineProps<{
  items?: MeshInsight[]
}>()
</script>
